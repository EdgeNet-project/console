<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Stevebauman\Location\Facades\Location;

class NodeCheckinTest extends TestCase
{
    use RefreshDatabase;

    public function test_node_checkin_success()
    {
        $position = new \Stevebauman\Location\Position();
        $position->ip = '1.1.1.1';
        $position->countryCode = 'US';
        $position->regionName = 'New York';
        $position->regionCode = 'NY';
        $position->latitude = '40.7128';
        $position->longitude = '-74.0060';

        // Mock Location
        Location::shouldReceive('get')
            ->once()
            ->andReturn($position);

        $response = $this->postJson('/api/node/checkin', [
            'ip' => '1.1.1.1',
            'uuid' => '550e8400-e29b-41d4-a716-446655440000',
            'code' => 'ABC123',
        ]);

        if ($response->status() !== 200) {
            dump($response->json());
        }

        $response->assertStatus(200);

        $response->assertJsonStructure([
                'name',
                'public_ip',
                'location' => [
                    'countryCode',
                    'regionName',
                    'regionCode',
                    'latitude',
                    'longitude',
                ],
            ]);
        
        $this->assertEquals('127.0.0.1', $response->json('public_ip'));
    }

    public function test_node_checkin_validation_error()
    {
        $response = $this->postJson('/api/node/checkin', [
            // Missing fields
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['ip', 'uuid', 'code']);
    }
}
