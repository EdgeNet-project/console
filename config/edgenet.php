<?php

return [
    'cluster' => [
        'api' => [
            'url' => env('EDGENET_API_SERVER', 'https://api.edge-net.org'),
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
