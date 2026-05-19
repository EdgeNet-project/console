<?php

return [

    /**
     * PlanetLab Node API configuration
     */
    'node' => [
        'domain' => env('PLANETLAB_NODE_URL', 'n.planetlab.io'),
    ],

    'wiregard' => [
        'domain' => env('PLANETLAB_WIREGARD_URL', 'wg.planetlab.io'),
        'port' => env('PLANETLAB_WIREGARD_PORT', 51820),

        'network' => env('PLANETLAB_WIREGARD_NETWORK', '10.80.0.0/16'),
        'public_key' => env('PLANETLAB_WIREGARD_PUBLIC_KEY'),
        'mtu' => env('PLANETLAB_WIREGARD_MTU', 1380),

    ]
];