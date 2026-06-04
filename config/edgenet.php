<?php

return [
    'console' => [
        'name' => env('EDGENET_CONSOLE_NAME', 'PlanetLab Console'),
        'url' => env('EDGENET_CONSOLE_URL', 'console.planetlab.io'),
        'logo' => env('EDGENET_CONSOLE_LOGO', '/img/logo.png'),
    ],
    'support' => [
        'name' => env('EDGENET_SUPPORT_NAME', 'PlanetLab Support Team'),
        'email' => env('EDGENET_SUPPORT_EMAIL', 'support@planetlab.io'),
        'signature' => 'Best regards,<br>PlanetLab Support Team'
    ],

    'boot' => [
        // The boot server is used to boot/install nodes.
        'server' => env('EDGENET_BOOT_SERVER', 'boot.edge-net.io')
    ],

    'cluster' => [
        'domain' => 'edge-net.io',

        'ca' => base_path( env('EDGENET_CLUSTER_CA', '.kube/ca.crt') ),
        'client' => [
            'cert' => base_path( env('EDGENET_CLUSTER_CLIENT', '.kube/client.crt') ),
            'key' => base_path( env('EDGENET_CLUSTER_CLIENT_KEY', '.kube/client.key') ),
        ],
        'kubeconfig' => base_path( env('EDGENET_CLUSTER_KUBECONFIG', '.kube/super-admin.conf') ),
        'context' => env('EDGENET_CLUSTER_CONTEXT', 'kubernetes-super-admin@kubernetes'),
        'host' => env('EDGENET_CLUSTER_HOST', 'https://hades.edge-net.io:6443'),
        'api' => env('EDGENET_CLUSTER_API', 'https://hades.edge-net.io:6443'),
    ],

];
