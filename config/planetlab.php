<?php

return [

    /**
     * PlanetLab Node API configuration
     */
    'node' => [
        'domain' => env('PLANETLAB_NODE_URL', 'n.planetlab.io'),
    ],

    'wireguard' => [
        'endpoint_ip' => env('PLANETLAB_WIREGUARD_ENDPOINT_IP', '132.227.123.79'),
        'endpoint_address' => env('PLANETLAB_WIREGUARD_ENDPOINT_ADDRESS', 'w.planetlab.io'),
        'endpoint_port' => env('PLANETLAB_WIREGUARD_ENDPOINT_PORT', 51820),
        'endpoint_key' => env('PLANETLAB_WIREGUARD_ENDPOINT_KEY'),

        'network' => env('PLANETLAB_WIREGUARD_NETWORK', '10.80.0.0/16'),
        'allowed_ips' => env('PLANETLAB_WIREGUARD_ALLOWED_IPS', '10.80.0.1/32, 10.80.0.0/16, 10.0.40.0/24'),
        'mtu' => env('PLANETLAB_WIREGUARD_MTU', 1380),
        'persistent_keepalive' => env('PLANETLAB_WIREGUARD_PERSISTENT_KEEPALIVE', 25),
    ],

    'kubernetes' => [
        'cluster_name' => env('PLANETLAB_KUBERNETES_CLUSTER_NAME', 'planetlab'),
        'api_server' => env('PLANETLAB_KUBERNETES_API_SERVER', 'https://10.80.0.1:443'),
        'cluster_dns' => env('PLANETLAB_KUBERNETES_CLUSTER_DNS', '10.96.0.10'),

    ]

];