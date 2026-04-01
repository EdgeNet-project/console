<?php

namespace Tests\Feature;

use App\Model\SubNamespace;
use App\Model\Tenant;
use App\Model\User;
use Illuminate\Support\Facades\Bus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class KubernetesWebhookTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test Kubernetes Audit Webhook.
     */
    public function test_audit_webhook_unauthorized_without_token()
    {
        Config::set('kubernetes.audit.token', 'secret-token');

        $response = $this->postJson(route('kubernetes.audit'), [
            'apiVersion' => 'audit.k8s.io/v1',
            'kind' => 'EventList',
            'items' => []
        ]);

        $response->assertStatus(401);
    }

    public function test_audit_webhook_authorized_with_token()
    {
        Config::set('kubernetes.audit.token', 'secret-token');

        $response = $this->withToken('secret-token')->postJson(route('kubernetes.audit'), [
            'apiVersion' => 'audit.k8s.io/v1',
            'kind' => 'EventList',
            'items' => [
                ['auditID' => '123', 'level' => 'Metadata']
            ]
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Audit events accepted.', 'accepted' => 1]);
    }

    public function test_audit_webhook_invalid_apiVersion()
    {
        $response = $this->postJson(route('kubernetes.audit'), [
            'apiVersion' => 'invalid/v1',
            'kind' => 'EventList',
            'items' => []
        ]);

        $response->assertStatus(400)
            ->assertJson(['message' => 'Unsupported apiVersion.']);
    }

    public function test_audit_webhook_empty_payload()
    {
        $response = $this->postJson(route('kubernetes.audit'), [
            'apiVersion' => 'audit.k8s.io/v1',
            'kind' => 'EventList',
            'items' => []
        ]);

        $response->assertStatus(400)
            ->assertJson(['message' => 'No audit events found in payload.']);
    }

    public function test_audit_webhook_single_event()
    {
        $response = $this->postJson(route('kubernetes.audit'), [
            'apiVersion' => 'audit.k8s.io/v1',
            'kind' => 'Event',
            'auditID' => '123',
            'level' => 'Metadata'
        ]);

        $response->assertStatus(200)
            ->assertJson(['accepted' => 1]);
    }

    /**
     * Test Kubernetes Authn Webhook.
     */
    public function test_authn_webhook_invalid_kind()
    {
        $response = $this->postJson(route('kubernetes.authn'), [
            'kind' => 'InvalidKind'
        ]);

        $response->assertStatus(400)
            ->assertJson(['status' => ['authenticated' => false]]);
    }

    public function test_authn_webhook_missing_token()
    {
        $response = $this->postJson(route('kubernetes.authn'), [
            'kind' => 'TokenReview',
            'spec' => []
        ]);

        $response->assertStatus(401)
            ->assertJson(['status' => ['authenticated' => false]]);
    }

    public function test_authn_webhook_invalid_token()
    {
        $response = $this->postJson(route('kubernetes.authn'), [
            'kind' => 'TokenReview',
            'spec' => ['token' => 'invalid-token']
        ]);

        $response->assertStatus(401)
            ->assertJson(['status' => ['authenticated' => false]]);
    }

    public function test_authn_webhook_successful_authentication_basic()
    {
        $user = User::create([
            'firstname' => 'Test',
            'lastname' => 'User',
            'email' => 'test-basic@example.com',
            'password' => bcrypt('password'),
        ]);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->postJson(route('kubernetes.authn'), [
            'kind' => 'TokenReview',
            'spec' => ['token' => $token]
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => [
                    'authenticated' => true,
                    'user' => [
                        'username' => 'test-basic@example.com',
                        'groups' => ['edgenet:user']
                    ]
                ]
            ]);
    }

    public function test_authn_webhook_successful_authentication_with_groups()
    {
        Bus::fake();

        $user = User::create([
            'firstname' => 'Test',
            'lastname' => 'User',
            'email' => 'test-groups@example.com',
            'password' => bcrypt('password'),
        ]);

        $tenant = Tenant::create(['name' => 'test-tenant']);
        $user->tenants()->attach($tenant->id, ['role' => 'owner']);

        $workspace = SubNamespace::create([
            'name' => 'test-workspace',
            'namespace' => 'test-workspace',
            'tenant_id' => $tenant->id,
        ]);
        $user->sub_namespaces()->attach($workspace->id, ['role' => 'owner']);

        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->postJson(route('kubernetes.authn'), [
            'kind' => 'TokenReview',
            'spec' => ['token' => $token]
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => [
                    'authenticated' => true,
                    'user' => [
                        'username' => 'test-groups@example.com',
                        'groups' => [
                            'edgenet:user',
                            'test-tenant',
                            'test-tenant:test-workspace'
                        ]
                    ]
                ]
            ]);
    }
}
