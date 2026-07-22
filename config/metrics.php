<?php

return [
    'retention' => [
        'raw_days' => env('METRICS_RETENTION_RAW_DAYS', 30),
        'hourly_months' => env('METRICS_RETENTION_HOURLY_MONTHS', 12),
    ],
];
