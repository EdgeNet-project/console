<?php

return [
    'clickhouse' => [
        'url' => env('CLICKHOUSE_URL'),
        'db' => env('CLICKHOUSE_DB', 'default'),
        'user' => env('CLICKHOUSE_USER', 'default'),
        'password' => env('CLICKHOUSE_PASSWORD'),
    ]
];