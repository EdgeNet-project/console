# SLICES OIDC Integration

This document describes the integration of SLICES OpenID Connect (OIDC) authentication into the EdgeNet Console application.

## Overview

The EdgeNet Console supports authentication through the SLICES (Scientific Large-scale Infrastructure for Computing/Communication Experimental Studies) platform using the OpenID Connect protocol. This allows users with SLICES accounts to seamlessly log into the console using their existing credentials.

## Architecture

### Authentication Flow

1. **User Initiates Login**: User clicks the SLICES login button in the console
2. **Redirect to SLICES**: User is redirected to the SLICES OIDC provider (`https://portal.slices-sc.eu`)
3. **User Authentication**: User authenticates with their SLICES credentials on the SLICES portal
4. **Callback with Authorization Code**: SLICES redirects back to the console callback URL with an authorization code
5. **Token Exchange**: The console exchanges the authorization code for user information
6. **User Provisioning**: The console creates or updates the local user account
7. **Session Creation**: A Sanctum token is generated and returned to the frontend
8. **Window Communication**: The callback page uses `postMessage` to send the token to the parent window
9. **Automatic Login**: The user is logged into the console

### Components

#### Backend (Laravel)

- **Controller**: `App\Http\Controllers\Authentication\SlicesAuthenticationController`
  - `redirect()`: Initiates the OIDC flow by redirecting to SLICES
  - `callback()`: Handles the callback, retrieves user info, and provisions the user

- **Routes** (`routes/web.php`):
  - `GET /auth/slices` - Initiates OIDC redirect
  - `GET /auth/slices/callback` - Handles OIDC callback

- **User Provisioning**:
  - Matches users by email address
  - Creates new users if they don't exist
  - Updates `slices_info` field with OIDC user data
  - Automatically marks email as verified
  - Logs authentication activity

#### Frontend (React)

- **Component**: `resources/js/console/Authentication/Login/SlicesLoginButton.jsx`
  - Renders the SLICES login button
  - Opens authentication popup window
  - Listens for `postMessage` from callback
  - Handles token storage and navigation

- **Styling**: `resources/js/console/Authentication/Login/OAuthLoginButton.module.css`
  - Provides consistent styling for OAuth login buttons

- **Callback View**: `resources/views/auth/slices.blade.php`
  - Minimal HTML page that posts message to opener window
  - Automatically closes after sending credentials

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```bash
# SLICES OIDC Configuration
SLICES_OIDC_BASE_URL=https://portal.slices-sc.eu
SLICES_OIDC_CLIENT_ID=your_client_id_here
SLICES_OIDC_CLIENT_SECRET=your_client_secret_here
SLICES_OIDC_REDIRECT_URI=https://your-console-domain.com/auth/slices/callback
SLICES_OIDC_SCOPES="openid profile email"
SLICES_OIDC_VERIFY_JWT=false
SLICES_OIDC_JWT_PUBLIC_KEY=
```

### Required Configuration Steps

1. **Register Application with SLICES**:
   - Contact SLICES administrators to register your EdgeNet Console instance
   - Obtain OAuth Client ID and Client Secret
   - Provide your callback URL: `https://your-domain.com/auth/slices/callback`

2. **Configure Socialite OIDC Provider**:
   - The application uses Laravel Socialite with the `socialiteproviders/oidc` package
   - OIDC provider configuration should be in `config/services.php`

3. **Database Migration**:
   - Ensure the `slices_info` column exists in the `users` table
   - Run migrations to add the field if needed

## User Data Mapping

The following user data is retrieved from SLICES and stored locally:

| SLICES Field | EdgeNet Console Field | Notes |
|--------------|----------------------|-------|
| `email` | `email` | Used as unique identifier |
| `first_name` | `firstname` | User's first name |
| `last_name` | `lastname` | User's last name |
| Full user object | `slices_info` | JSON field storing complete OIDC response |

## Security Considerations

- **Token Storage**: Sanctum tokens are used for session management
- **Activity Logging**: All SLICES authentication attempts are logged with IP and user agent
- **Email Verification**: Users authenticated via SLICES are automatically marked as verified
- **HTTPS Required**: OAuth callbacks must use HTTPS in production
- **Window Communication**: Uses `postMessage` with origin verification for secure credential transfer

## Testing

### Local Development

For local development, you may need to:

1. Use a tunnel service (ngrok, LocalTunnel) to expose your local server via HTTPS
2. Update the `SLICES_OIDC_REDIRECT_URI` to point to your tunnel URL
3. Register the tunnel URL with SLICES as an authorized callback

### Test Accounts

Contact SLICES administrators for test account credentials.

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**:
   - Ensure `SLICES_OIDC_REDIRECT_URI` matches exactly what's registered with SLICES
   - Check for trailing slashes and protocol (http vs https)

2. **Popup Blocked**:
   - The authentication flow uses a popup window
   - Users may need to allow popups for the console domain

3. **Token Not Received**:
   - Check browser console for `postMessage` errors
   - Verify `APP_URL` matches the origin expected by the callback page

4. **User Not Created**:
   - Check Laravel logs for database errors
   - Verify `slices_info` column exists and accepts JSON

## Related Files

- Controller: `app/Http/Controllers/Authentication/SlicesAuthenticationController.php`
- Routes: `routes/web.php`
- Frontend Component: `resources/js/console/Authentication/Login/SlicesLoginButton.jsx`
- Callback View: `resources/views/auth/slices.blade.php`
- Styles: `resources/js/console/Authentication/Login/OAuthLoginButton.module.css`
- Environment Config: `.env.example` (lines 63-70)
