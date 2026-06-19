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

    ]
];