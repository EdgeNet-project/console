<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ClickHouseService
{
    public function select(string $sql): array
    {
        $url = rtrim(config('flow.clickhouse.url'), '/') . '/?' . http_build_query([
            'database' => config('flow.clickhouse.db'),
            'default_format' => 'JSONEachRow',
        ]);

        $response = Http::withBasicAuth(
            config('flow.clickhouse.user'),
            config('flow.clickhouse.password')
        )->withBody($sql, 'text/plain')->post($url);

        if ($response->failed()) {
            Log::error('ClickHouse error', [
                'url' => $url,
                'sql' => $sql,
                'response' => $response->body(),
            ]);

            throw new \Exception("ClickHouse Error: " . $response->body() . " (SQL: $sql)");
        }

        $response->throw();

        $body = trim($response->body());
        if ($body === '') {
            return [];
        }

        return array_map(
            static fn ($line) => json_decode($line, true, 512, JSON_THROW_ON_ERROR),
            preg_split('/\r\n|\r|\n/', $body, -1, PREG_SPLIT_NO_EMPTY)
        );
    }
}