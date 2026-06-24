<?php

return [
    'orchestrator' => [
        'host' => env('NODEMANAGER_OERCHESTRATOR_HOST', 'n.planetlab.io'),
    ],

    /**
     * Nodemanager package repository
     */
    'repository' => [
        'name' => env('NODEMANAGER_REPOSITORY_NAME', 'planetlab'),
        'host' => env('NODEMANAGER_REPOSITORY_HOST', 'r.planetlab.io'),

    ],

    /**
     * Node setup configuration
     */
    'setup' => [
        /**
         * List of users that will be created on the node
         */
        'users' => [
            [
                'name' => 'planetlab',
                'public_key' => 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKjtRjXehOq2CkwI3dsDeec5mC8KxykSoSeywES4nrw9 planetlab.io',
                'sudo' => true,
            ]
        ]
    ]
];