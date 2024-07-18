<?php

namespace App\Http\Controllers\Boot;

use App\Http\Controllers\Controller;
use App\Model\Node;
use App\Model\NodeStatus;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use Stevebauman\Location\Facades\Location;
use Symfony\Component\Yaml\Yaml;
use \Ovh\Api;

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
    public function bootstrap(Node $node)
    {
        if ($node->status && $node->status == NodeStatus::OK) {
            return response()->view('boot.message', [
                'message' => 'Node is already installed'
            ])->header('Content-Type', 'text/plain');
        }

        return response()->view('node.bootstrap', [
            'node' => $node
        ])->header('Content-Type', 'text/plain');
    }

    public function name(Request $request)
    {
        $node = $request->get('node');

        return response()
            ->view($node->name)
            ->header('Content-Type', 'text/plain');
    }

    public function hostname(Request $request)
    {
        $node = $request->get('node');

        return response()
            ->view($node->hostname)
            ->header('Content-Type', 'text/plain');
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     *
     * Registers node activity
     */
    public function log(Request $request)
    {
        $data = $request->validate([
            'severity' => 'required|string',
            'message' => 'required|string'
        ]);

        $node = $request->get('node');

        activity('nodes')
            ->performedOn($node)
            //->causedBy($user)
            ->withProperties(['severity' => $data['severity']])
            ->log($data['message']);

        return response('');
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     *
     *
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'host' => 'required|array',
            'ip' => 'required|array'
        ]);

        Log::info("Node sending info", [
            'host' => $data['host'],
            'ip' => $data['ip']
        ]);

        $domain = config('edgenet.cluster.domain');

        $node = $request->get('node');
        $node->name = $data['name'];
        $node->status = NodeStatus::INSTALLING;
        $node->info = [
            'host' => $data['host'],
            'ip' => $data['ip']
        ];
        $node->ip_v4 = $data['host']['network']['ip'];


        if ($position = Location::get($request->ip())) {
            /*
             * "ip":"2001:660:3302:287b:5054:ff:fefb:472e",
             * "driver":"Stevebauman\\Location\\Drivers\\IpData",
             * "countryName":"France",
             * "currencyCode":"EUR",
             * "countryCode":"FR",
             * "regionCode":"IDF",
             * "regionName":"Île-de-France",
             * "cityName":"Montreuil",
             * "zipCode":"93100",
             * "isoCode":null,
             * "postalCode":"93100",
             * "latitude":"48.86190032959",
             * "longitude":"2.4505999088287",
             * "metroCode":null,
             * "areaCode":null,
             * "timezone":"Europe/Paris"}
             */
            $node->location = [
                'countryName' => $position->countryName,
                'countryCode' => $position->countryCode,
                'regionName' => $position->regionName,
                'regionCode' => $position->regionCode,
                'latitude' => $position->latitude,
                'longitude' => $position->longitude,
                'timezone' => $position->timezone,
            ];

            if (!$node->name) {
                $node->name = Str::lower($position->countryCode . '-' . $position->regionCode . '-' . Str::random(3));
            }

            //$node->hostname = $node->name . '.' . $domain;

            // this should go in a job
            // https://eu.api.ovh.com/console/?section=%2Fdomain&branch=v1#post-/domain/zone/-zoneName-/record
            $ovh = new Api(
                env('OVH_APP_KEY'),
                env('OVH_APP_SECRET'),
                'ovh-eu',
                env('OVH_CONSUMER_KEY'));



            try {

                Log::info('OVH Request to /domain/zone/'.$domain.'/record');
                $record = $ovh->get('/domain/zone/'.$domain.'/record', [
                    'fieldType' => 'A',
                    'subDomain' => $node->name,
                ]);

                if ($record && isset($record[0])) {
                    // update record
                    Log::info('OVH updating ' . $node->name. ' => ' . $node->ip_v4);
                    $ovh->put('/domain/zone/'.$domain.'/record/' . $record[0], [
                        'subDomain' => $node->name,
                        'target' => $node->ip_v4,
                        'ttl' => 3600,
                    ]);
                } else {
                    // create a new record
                    Log::info('OVH creating ' . $node->name. ' => ' . $node->ip_v4);
                    $ovh->post('/domain/zone/'.$domain.'/record', [
                        'fieldType' => 'A',
                        'subDomain' => $node->name,
                        'target' => $node->ip_v4,
                        'ttl' => 3600,
                    ]);
                }

                // refreshing the zone to update the changes
                $ovh->post('/domain/zone/'.$domain.'/refresh');

            } catch (GuzzleHttp\Exception\ClientException $e) {
                $response = $e->getResponse();
                $responseBodyAsString = $response->getBody()->getContents();
                Log::error($responseBodyAsString);
            } catch (\Exception $e) {
                Log::error("OVH API ERROR", ['message' => $e->getMessage()]);
            }
        } else {
            // Failed retrieving position.
            //return response()->json(['message' => 'failed position'], 500);
            $node->name = $node->ip_v4;

        }
        $node->save();

        /**
         * Create a bootstrap token so that the node can authenticate
         * and join the cluster.
         */
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
        $token->createOrUpdate();


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
            ' --v=5' .
            ' --node-name ' . $node->hostname .
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
