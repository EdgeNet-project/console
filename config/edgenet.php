<?php

return [
    'boot' => [
        // The boot server is used to boot/install nodes.
        'server' => env('EDGENET_BOOT_SERVER', 'boot.edge-net.io')
    ],

    'cluster' => [
        'domain' => 'edge-net.io',
        'host' => env('EDGENET_CLUSTER_HOST', 'https://hades.edge-net.io:6443'),
    ],

];
