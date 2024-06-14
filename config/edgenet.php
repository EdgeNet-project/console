<?php

return [
    'boot' => [
        // The boot server is used to boot/install nodes.
        'server' => env('EDGENET_BOOT_SERVER', 'boot.edge-net.io')
    ],

    'cluster' => [
        'domain' => 'edge-net.io',
        'url' => env('CLUSTER_URL', 'https://hades.edge-net.io:6443'),

        // ??
        'api' => [
            'url' => env('EDGENET_API_SERVER', 'https://hades.edge-net.io:6443'),
            'prefix' => '/api/v1'
        ]
    ],

    // to remove
    'api' => [
        'server' => env('EDGENET_API_SERVER', config('kubernetes.api.server', 'https://api.edge-net.org')),
        'prefix' => [
            'core' => env('EDGENET_API_PREFIX', '/apis/core.edgenet.io/v1alpha'),
            'registration' => env('EDGENET_API_PREFIX', '/apis/registration.edgenet.io/v1alpha')
        ]
    ]
];
