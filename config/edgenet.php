<?php

return [
    'boot' => [
        // The boot server is used to boot/install nodes.
        'server' => env('EDGENET_BOOT_SERVER', 'boot.edge-net.io')
    ],

    'cluster' => [
        'domain' => 'edge-net.io',
        'ca' => env('EDGENET_CLUSTER_CA', '/etc/kubernetes/pki/ca.crt'),
        'host' => env('EDGENET_CLUSTER_HOST', 'https://hades.edge-net.io:6443'),
        'api' => env('EDGENET_CLUSTER_API', 'https://hades.edge-net.io:6443'),
    ],

];
