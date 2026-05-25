<?php

namespace App\Http\Controllers\Node;

use App\Http\Controllers\Controller;
use App\Model\Node;
use Carbon\Carbon;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use RenokiCo\PhpK8s\Exceptions\KubernetesAPIException;
use RenokiCo\PhpK8s\Exceptions\PhpK8sException;
use Symfony\Component\Yaml\Yaml;

class KubernetesController extends Controller
{

    /**
     *
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function join(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'uuid' => 'required|uuid',
            'name' => 'required|string|max:20|regex:/^[a-zA-Z0-9\-]+$/',
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
            $node = Node::where([
                ['system_uuid', $request->input('uuid')],
                ['name', $request->input('name')],
            ])->first();
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

        $clusterNode = $this->createNode(
            $node
        );

        if(!$clusterNode) {
            return response()->json(['error' => 'Node creation failed'],400);
        }

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

    /**
     * Check if the node resource exists in the Kubernetes cluster.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function ready(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'uuid' => 'required|uuid',
            'name' => 'required|string|max:20|regex:/^[a-zA-Z0-9\-]+$/',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $node = Node::where([
                ['system_uuid', $request->input('uuid')],
                ['name', $request->input('name')],
                ['enabled', true],
            ])->first();
        } catch (\Exception $e) {
            Log::channel('nodes')->error("[kubernetes] ready lookup: " . $e->getMessage());
            return response()->json([
                'error' => 'An error occurred during node lookup (node not found or not enabled)'
            ], 500);
        }

        if (!$node) {
            return response()->json([
                'error' => 'Node not found'
            ], 404);
        }


        try {
            $clusterNode = K8s::getNodeByName($node->name);

            $clusterNode
//                ->setAttribute('spec.taints', [])
                ->setAttribute('metadata.annotations.edge-net.io/join-completed-at',
                    now()->toIso8601String())
                ->update();

        } catch (KubernetesAPIException $e) {
            if ($e->getCode() === 404) {
                return response()->json([
                    'ready' => false,
                ]);
            }

            Log::channel('nodes')->error("[kubernetes] ready k8s check: " . $e->getMessage());
            return response()->json([
                'error' => 'Could not check node status in cluster'
            ], 500);
        }

        return response()->json([
            'ready' => true,
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

        /**
         * --- -> For this CSR to be auto approved the following ClusterRoleBinding must be created:
         * ---
         * kind: ClusterRoleBinding
         * metadata:
         *   name: auto-approve-csrs-for-group
         * subjects:
         *   - kind: Group
         *     name: system:bootstrappers:nodemanager
         * roleRef:
         *   kind: ClusterRole
         *   name: system:certificates.k8s.io:certificatesigningrequests:nodeclient
         *
         * --- -> Allow already-running kubelets to renew their own certs
         * ---
         * kind: ClusterRoleBinding
         * metadata:
         *   name: auto-approve-renewals-for-nodes
         * subjects:
         *   - kind: Group
         *     name: system:nodes
         * roleRef:
         *   kind: ClusterRole
         *   name: system:certificates.k8s.io:certificatesigningrequests:selfnodeclient
         */
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
  auth-extra-groups: system:bootstrappers:nodemanager'
        );

        return $token->createOrUpdate();
    }

    /**
     * Creates Node resource in Kubernetes
     * @param Node $node
     * @return bool
     */
    private function createNode(Node $node): bool {
        $name = $node->name;
        $arch = $node->os['arch'] ?? 'amd64';

        $labels = [
            'kubernetes.io/arch' => $arch,
            'kubernetes.io/os' => 'linux',

            'planetlab.io/site' => $name,
//            'planetlab.io/provider' => $nodeData->platform ?? 'baremetal',
//            'planetlab.io/tier' => $nodeData->role ?? 'edge',
//            'planetlab.io/wireguard-ip' => $node->wireguard['address'] ?? $node->ip_v4,
//            'planetlab.io/enrolled-by' => 'nodemanager',

            'topology.kubernetes.io/region' => explode('-', $name)[0] ?? 'unknown',
            'topology.kubernetes.io/zone' => implode('-', array_slice(explode('-', $name), 0, 2)) ?: 'unknown',
        ];

        $annotations = [
            'edge-net.io/orchestrator-node-id'   => (string)$node->id,
            'edge-net.io/join-requested-at'      => now()->toIso8601String(),
            'edge-net.io/wireguard-pubkey'       => (string)$node->wireguard['public_key'],
            'edge-net.io/wireguard-ip'           => (string)$node->wireguard['address'],
            'cluster-autoscaler.kubernetes.io/scale-down-disabled' => 'true',
        ];

//        $taints = [
////            'key'    => 'node.kubernetes.io/not-ready',
////            'effect' => 'NoSchedule',
//        ];


        $clusterNode = null;
        try {
            $clusterNode = K8s::getNodeByName($name);
        } catch (KubernetesAPIException $e) {
            if ($e->getCode() !== 404) {
                Log::channel('nodes')->error('[' . $name . '] Node registration failed', [
                    'payload' => $e->getPayload(),
                    'error' => $e->getMessage()
                ]);
                return false;
            }
        }

        if (!$clusterNode) {
            Log::channel('nodes')->info('[' . $name . '] Node does not exist, creating...', []);
            try {
                $clusterNode = K8s::node()
                ->setName($name)
                ->setAttribute('metadata.labels', $labels)
                ->setAttribute('metadata.annotations', $annotations)
                ->setAttribute('metadata.taints', [])
                ->setAttribute('status.addresses', [
                    ['type' => 'InternalIP', 'address' => (string)$node->wireguard['address'] ?? $node->ip_v4],
                    ['type' => 'Hostname',   'address' => $name],
                ])
                ->create();
            } catch (KubernetesAPIException $e) {
                Log::channel('nodes')->error('[' . $name . '] Node registration failed', [
                    'payload' => $e->getPayload(),
                    'error' => $e->getMessage()
                ]);
                return false;
            }
        } else {
            Log::channel('nodes')->info('[' . $name . '] Node already exists, patching...', []);
            try {
                $clusterNode
                    ->setAttribute('metadata.labels', $labels)
                    ->setAttribute('metadata.annotations', $annotations)
                    ->setAttribute('metadata.taints', [])
                    ->update();
            } catch (KubernetesAPIException $e) {
                Log::channel('nodes')->error('[' . $name . '] Node patch failed', [
                    'payload' => $e->getPayload(),
                    'error' => $e->getMessage()
                ]);

                return false;
            }
        }

        return true;
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

    private function getCaCertDigest() {
        /**
         * This procedure creates the CA key hash needed for CA pinning.
         * Kubeadm uses it to authenticate the server when joining a node.
         *
         * https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-join/#token-based-discovery-with-ca-pinning
         */

        // Certification Authority certificate
        $ca = $this->getCaCert();

        // get the public key from the certificate and decode it (converts to PEM format)
        $pem_data = openssl_pkey_get_details(
            openssl_pkey_get_public(base64_decode($ca))
        )['key'];

        // converts the public key to DER binary format
        $begin = "KEY-----";
        $end   = "-----END";
        $pem_data = substr($pem_data, strpos($pem_data, $begin)+strlen($begin));
        $pem_data = substr($pem_data, 0, strpos($pem_data, $end));
        $der = base64_decode($pem_data);

        // creates the digest that will be used by kubeadm (or similar) join procedure
        $digest = openssl_digest($der, 'sha256');

        return $digest;

    }

    private function getClusterDns() {
        $dnsService = K8s::service()
            ->whereNamespace('kube-system')
            ->getByName('kube-dns');

        return $dnsService->getAttribute('spec.clusterIP', config('planetlab.kubernetes.cluster_dns'));
    }

}