<?php

namespace App\Http\Controllers\Boot;

use App\Http\Controllers\Controller;
use App\Model\Node;
use App\Model\NodeStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use Stevebauman\Location\Facades\Location;
use Symfony\Component\Yaml\Yaml;

function pem2der($pem_data) {
    $begin = "KEY-----";
    $end   = "-----END";
    $pem_data = substr($pem_data, strpos($pem_data, $begin)+strlen($begin));
    $pem_data = substr($pem_data, 0, strpos($pem_data, $end));
    $der = base64_decode($pem_data);
    return $der;
}

function der2pem($der_data) {
    $pem = chunk_split(base64_encode($der_data), 64, "\n");
    $pem = "-----BEGIN CERTIFICATE-----\n".$pem."-----END CERTIFICATE-----\n";
    return $pem;
}

class NodeController extends Controller
{


    /**
     * @param Node $node
     * @return \Illuminate\Http\Response
     *
     * Node authentication
     */
//    public function auth(Node $node)
//    {
//
//        return response()
//            ->view($node->createToken('node-authentication', ['node:management'])
//                ->plainTextToken)
//            ->header('Content-Type', 'text/plain');
//    }

    /**
     * @param Node $node
     * @return \Illuminate\Http\Response
     *
     * Renders the shell script used to boot/setup the node
     */
    public function script(Node $node)
    {
        if ($node->status !== NodeStatus::TO_INSTALL) {
            return response()->view('boot.message', [
                'message' => 'Node is already installed'
            ])
                ->header('Content-Type', 'text/plain');
        }

        return response()->view('boot.kubeadm.index', [
            'node' => $node
        ])->header('Content-Type', 'text/plain');
    }

    public function log(Request $request)
    {
        $data = $request->validate([
            'severity' => 'required|string',
            'message' => 'required|string',
            'status' => 'string',
        ]);

        $node = $request->get('node');

        activity('nodes')
            ->performedOn($node)
            //->causedBy($user)
            ->withProperties(['severity' => $data['severity']])
            ->log($data['message']);

        if (($data['status']) && (in_array(
            [NodeStatus::INSTALLING, NodeStatus::OK], $data['status'],
        ))) {
            $node->status = $data['status'];
        }

        return response('');
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     *
     * STAGE 1: registers the node, uses the auth code to obtain a token
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'auth' => 'required',
            'host' => 'required|array',
            'ip' => 'required|array'
        ]);

        Log::info("Node sending info", [
            'host' => $data['host'],
            'ip' => $data['ip']
        ]);

        $node = Node::where('auth', $data['auth'])->first();
        if (!$node) {
            return response()->json('', 404);
        }

        $node->info = [
            'host' => $data['host'],
            'ip' => $data['ip']
        ];
        $node->ip_v4 = $data['host']['network']['ip'];
        $node->save();

//        if ($position = Location::get($node->ip_v4)) {
//            // Successfully retrieved position.
//            //print_r($position);
//            //echo $position->countryName;
//        } else {
//            // Failed retrieving position.
//            return response()->json(['message' => 'failed position'], 500);
//        }

        $token = K8s::getCluster()->fromYaml(
'apiVersion: v1
kind: Secret
metadata:
  name: bootstrap-token-'.$node->token_id.'
  namespace: kube-system
type: bootstrap.kubernetes.io/token
stringData:
  description: "Bootstrap token for node '.$node->auth.'"
  token-id: '.$node->token_id.'
  token-secret: '.$node->token_secret.'
  expiration: '.Carbon::now()->addHours(2)->toIso8601String().'
  usage-bootstrap-authentication: "true"
  usage-bootstrap-signing: "true"
  auth-extra-groups: system:bootstrappers:kubeadm:default-node-token'
);
//
        $token->createOrUpdate();

        /**
         * Kubernetes API server and CA certificate needed by the kubelet config
         */
//        $contextCreate = stream_context_create([
//            'ssl' => [
//                'capture_peer_cert' => true,
//                'allow_self_signed' => false,
//                'verify_peer' => false
//            ]
//        ]);

        /**
         * This procedure creates the CA key hash needed for CA pinning.
         * Kubeadm uses it to authenticate the server when joining a node.
         *
         * https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-join/#token-based-discovery-with-ca-pinning
         */
        // retrieve the Kubernetes cluster public configmap containing the CA info
        $kubeRootCa = K8s::getCluster()
            ->getConfigMapByName('cluster-info','kube-public')
            ->getData();

        // parse YAML to array
        $kubeconfig_yaml = Yaml::parse($kubeRootCa['kubeconfig']);

        if (!isset($kubeconfig_yaml['clusters'][0]['cluster']['certificate-authority-data'])) {
            return response()->json(['message' => 'kubeconfig yaml parse error'], 500);
        }

        // extract the Certification Authority certificate
        $ca = $kubeconfig_yaml['clusters'][0]['cluster']['certificate-authority-data'];

        // get the public key from the certificate and decode it (converts to PEM format)
        $pkey = openssl_pkey_get_details(
            openssl_pkey_get_public(base64_decode($ca))
        )['key'];

        // converts the public key to DER binary format
        $der = pem2der($pkey);

        // creates the digest that will be used by kubeadm (or similar) join procedure
        $digest = openssl_digest($der, 'sha256');

        // the kubeadm command line
        $kubeadm = 'kubeadm join '.str_replace('https://','', config('edgenet.cluster.url')).
            ' --token ' . $node->token .
            ' --discovery-token-ca-cert-hash sha256:' . $digest;

        /**
         * Kubelet configuration that will be returned to the node.
         */
//        $kubeconfig =
//'apiVersion: v1
//kind: Config
//clusters:
//- name: edgenet
//  cluster:
//    server: "'.config('edgenet.cluster.url').'"
//    certificate-authority-data: '.base64_encode($kubeRootCa['ca.crt']).'
//users:
//- name: kubelet
//  user:
//    token: "'.$node->token.'"
//contexts:
//- context:
//    cluster: edgenet
//    user: kubelet';


        return response($kubeadm)
            ->header('Content-Type', 'text/plain');
    }
}
