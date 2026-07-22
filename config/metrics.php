<?php

return [
    'retention' => [
        'raw_days' => env('METRICS_RETENTION_RAW_DAYS', 30),
        'hourly_months' => env('METRICS_RETENTION_HOURLY_MONTHS', 12),
        'daily_years' => env('METRICS_RETENTION_DAILY_YEARS', 5),
        'weekly_years' => env('METRICS_RETENTION_WEEKLY_YEARS', 10),
    ],
];
