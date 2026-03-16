<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    /*
     * SLICES OIDC authentication provider
     * https://doc.slices-sc.eu/testbed_owner/oauth.html
     *
     * package:
     * https://github.com/Kovah/laravel-socialite-oidc
     */
    'oidc' => [
        'base_url' => env('SLICES_OIDC_BASE_URL','https://portal.slices-sc.eu'),
        'client_id' => env('SLICES_OIDC_CLIENT_ID'),
        'client_secret' => env('SLICES_OIDC_CLIENT_SECRET'),
        'redirect' => env('SLICES_OIDC_REDIRECT_URI','https://console.planetlab.io/auth/slices/callback'),

        'scopes' => env('SLICES_OIDC_SCOPES', 'openid profile email'),

        // Optional: Enable JWT signature verification (default: false)
        'verify_jwt' => env('SLICES_OIDC_VERIFY_JWT', false),

        // Optional: Provide a specific public key for JWT verification
        // If not provided, the key will be fetched from the OIDC provider's JWKS endpoint
        'jwt_public_key' => env('SLICES_OIDC_JWT_PUBLIC_KEY'),
    ],

    /*
     * GITHUB authentication
     */
    'github' => [
        'client_id' => env('GITHUB_CLIENT_ID'),
        'client_secret' => env('GITHUB_CLIENT_SECRET'),
        'redirect' => env('GITHUB_REDIRECT_URI'),
    ],

];
