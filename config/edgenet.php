<?php

return [
    'api' => [
        'server' => env('EDGENET_API_SERVER', config('kubernetes.api.server', 'https://api.edge-net.org')),
        'prefix' => [
            'core' => env('EDGENET_API_PREFIX', '/apis/core.edgenet.io/v1alpha'),
            'registration' => env('EDGENET_API_PREFIX', '/apis/registration.edgenet.io/v1alpha')
        ]
    ]
];
