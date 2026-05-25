<?php

namespace App\Http\Controllers\Node;

use App\Http\Controllers\Controller;
use App\Model\Node;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use Symfony\Component\Yaml\Yaml;

class KubernetesController extends Controller
{

    /**
     *
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function kubernetes(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'uuid' => 'required|uuid',
            'hostname' => 'required|string|max:20|regex:/^[a-zA-Z0-9\-]+$/',
            'token' => 'nullable|string|regex:/^[a-z0-9]{6}\.[a-z0-9]{16}$/',
        ]);

        if ($validator->fails()) {
            Log::channel('nodes')->error("[kubernetes] validation: " . print_r($validator->errors(), true));
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // check if node exists
            $node = Node::where('system_uuid', $request->input('uuid'))->first();
        } catch (\Exception $e) {
            Log::channel('nodes')->error("[kubernetes] lookup: " . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred during node lookup'
            ], 500);
        }

        if (!$node) {
            Log::channel('nodes')->error("[kubernetes] not found: code=" . $request->input('code'));
            return response()->json([
                'error' => 'This node is not in our records or an error occurred during node lookup'
            ], 404);
        }

        if (!$node->enabled) {
            Log::channel('nodes')->error("[kubernetes] not enabled: node_id=" . $node->id);
            return response()->json([
                'error' => 'Node is not enabled'
            ], 403);
        }

        $tokenId = $request->input('token-id');
        $tokenSecret = $request->input('token-secret');

        if ($request->filled('token')) {
            [$tokenId, $tokenSecret] = explode('.', $request->input('token'));
        }

        $token = $this->generateToken(
            $node->name,
            $tokenId,
            $tokenSecret
        );

        if(!$token) {
            return response()->json([
                'error' => 'Token generation failed'
            ], 400);
        }

        $tokenData = $token->getData(true);
        $bootstrap_token = $tokenData['token-id'] . '.' . $tokenData['token-secret'];

        $cluster_dns = $this->getClusterDns();

        return response()->json([
            'cluster_name' => config('planetlab.kubernetes.cluster_name'),
            'api_server' => config('planetlab.kubernetes.api_server'),
            'node_ip' => $node->wireguard['address'] ?? $node->ip_v4,
            'bootstrap_token' => $bootstrap_token,
            'ca_cert' => $this->getCaCert(),
            'kubelet_config' => config('planetlab.kubernetes.kubelet_config', ''),
            'cluster_dns' => $cluster_dns,
        ]);
    }

    // [a-z0-9]{6}\.[a-z0-9]{16}
    function generateRandomString($length = 6) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    /**
     * Create a bootstrap token so that the node can authenticate
     * and join the cluster.
     */
    private function generateToken($name, $token_id = null, $token_secret = null) {

        if (!$token_id || !$token_secret) {
            $token_id = $this->generateRandomString(6);
            $token_secret = $this->generateRandomString(16);
        }

        $token = K8s::getCluster()->fromYaml(
            'apiVersion: v1
kind: Secret
metadata:
  name: bootstrap-token-'.$token_id.'
  namespace: kube-system
type: bootstrap.kubernetes.io/token
stringData:
  description: "Bootstrap token for node '.$name.'"
  token-id: '.$token_id.'
  token-secret: '.$token_secret.'
  expiration: '.Carbon::now()->addHours(2)->toIso8601String().'
  usage-bootstrap-authentication: "true"
  usage-bootstrap-signing: "true"
  auth-extra-groups: system:bootstrappers:kubeadm:default-node-token'
        );

        return $token->createOrUpdate();
    }

    private function getCaCert()
    {
        try {
            $kubeRootCa = K8s::getCluster()
                ->getConfigMapByName('cluster-info', 'kube-public')
                ->getData();

            $kubeconfig_yaml = Yaml::parse($kubeRootCa['kubeconfig']);

            return $kubeconfig_yaml['clusters'][0]['cluster']['certificate-authority-data'] ?? '';
        } catch (\Exception $e) {
            Log::channel('nodes')->error("[kubernetes] getCaCert: " . $e->getMessage());
            return '';
        }
    }

    private function getClusterRootCa() {
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
        $der = $this->pem2der($pkey);


        // creates the digest that will be used by kubeadm (or similar) join procedure
        $digest = openssl_digest($der, 'sha256');

        return $digest;

    }

    private function pem2der($pem_data) {
        $begin = "KEY-----";
        $end   = "-----END";
        $pem_data = substr($pem_data, strpos($pem_data, $begin)+strlen($begin));
        $pem_data = substr($pem_data, 0, strpos($pem_data, $end));
        $der = base64_decode($pem_data);
        return $der;
    }

    private function getClusterDns() {
        $dnsService = K8s::service()
            ->whereNamespace('kube-system')
            ->getByName('kube-dns');

        return $dnsService->getAttribute('spec.clusterIP', config('planetlab.kubernetes.cluster_dns'));
    }

}