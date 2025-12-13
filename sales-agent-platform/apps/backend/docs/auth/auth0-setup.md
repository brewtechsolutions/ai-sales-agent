# Auth0 Authentication Setup (Free Tier Compatible)

## Overview

The backend uses **Auth0** for authentication, supporting:
- ✅ **Google OAuth** login
- ✅ **Email/Password** registration and login
- ✅ **Password setup** for Google users (allows Google users to also login with password)
- ✅ **Duplicate email handling** (automatic account linking)

## Free Tier vs Advanced Setup

### 🆓 Free Tier Setup (Recommended)
- **Only requires**: `AUTH0_DOMAIN`
- **Frontend handles**: All authentication (signup, login, Google OAuth)
- **Backend does**: Token verification and user sync
- **No M2M needed**: Works perfectly with free tier!

### 🔧 Advanced Setup (Optional)
- **Requires**: M2M application for Management API
- **Allows**: Backend to create/update users in Auth0
- **Use cases**: Backend-initiated user creation, password setup endpoint

## Architecture

### Authentication Flow

```
┌─────────────┐
│   Frontend  │
└──────┬──────┘
       │
       │ 1. User authenticates with Auth0
       │    (Google OAuth or Email/Password)
       │
       ▼
┌─────────────┐
│    Auth0    │
│  (Identity  │
│  Provider)  │
└──────┬──────┘
       │
       │ 2. Auth0 returns access token
       │
       ▼
┌─────────────┐
│   Backend   │
│  (tRPC API) │
└──────┬──────┘
       │
       │ 3. Verify token & sync user to database
       │
       ▼
┌─────────────┐
│  Database   │
│  (Postgres) │
└─────────────┘
```

## Setup Instructions

### 1. Create Auth0 Account

1. Go to [Auth0 Dashboard](https://auth0.com/)
2. Sign up for a free account
3. Create a new tenant (or use existing)

### 2. Configure Auth0 Connections

#### Enable Google OAuth Connection

1. Go to **Authentication** → **Social**
2. Click on **Google**
3. Enable the connection
4. Configure Google OAuth credentials:
   - Get Client ID and Client Secret from [Google Cloud Console](https://console.cloud.google.com/)
   - Add to Auth0 Google connection settings
5. Note the connection name (default: `google-oauth2`)

#### Enable Email/Password Connection

1. Go to **Authentication** → **Database**
2. Click on **Username-Password-Authentication** (or create new)
3. Ensure it's enabled
4. Configure password policy:
   - Minimum length: 8 characters
   - Require uppercase, lowercase, numbers
5. Note the connection name (default: `Username-Password-Authentication`)

### 3. Create Auth0 Application (Free Tier - Only One Needed!)

#### Application: Regular Web Application (for Frontend)

1. Go to **Applications** → **Create Application**
2. Name: `Sales Agent Platform - Web App`
3. Type: **Regular Web Application**
4. Click **Create**
5. Go to **Settings**:
   - **Allowed Callback URLs**: 
     ```
     http://localhost:5173/auth/callback
     https://yourdomain.com/auth/callback
     ```
     ⚠️ **IMPORTANT**: The callback URL must be `/auth/callback` (not just `/callback`)
   - **Allowed Logout URLs**: 
     ```
     http://localhost:5173
     https://yourdomain.com
     ```
   - **Allowed Web Origins**: 
     ```
     http://localhost:5173
     https://yourdomain.com
     ```
   - **Grant Types**: Enable:
     - ✅ Authorization Code
     - ✅ Refresh Token
6. Save the **Client ID** (Client Secret is optional for free tier)

**⚠️ Common Issue: Callback URL Mismatch**

If you see "Callback URL mismatch" error:
1. Check the exact URL in the error message
2. Make sure it matches EXACTLY what you entered in "Allowed Callback URLs"
3. The callback URL should be: `http://localhost:5173/auth/callback` (note the `/auth/` prefix)
4. Make sure there are no trailing slashes or typos

**That's it for free tier!** Frontend will handle all authentication.

---

### 4. Optional: Machine-to-Machine Application (Only if needed)

**Skip this if you're on free tier and frontend handles authentication!**

Only create this if you need:
- Backend to create users in Auth0
- Backend password setup endpoint
- Other Management API operations

1. Go to **Applications** → **Create Application**
2. Name: `Sales Agent Platform - Backend API`
3. Type: **Machine to Machine Applications**
4. Click **Create**
5. Select **Auth0 Management API**
6. Authorize and select these permissions:
   - `read:users`
   - `create:users`
   - `update:users`
   - `update:users_app_metadata`
7. Save the **Client ID** and **Client Secret**

### 4. Configure Environment Variables

#### Free Tier Setup (Minimum Required)

Add this to your `.env` file:

```env
# REQUIRED: Auth0 Domain (for token verification)
AUTH0_DOMAIN="your-tenant.auth0.com"
```

That's it! Backend will verify tokens from frontend.

#### Advanced Setup (Optional - if using Management API)

If you created the M2M application, also add:

```env
# Optional: Regular Web Application (for backend password grant)
AUTH0_CLIENT_ID="your-regular-app-client-id"
AUTH0_CLIENT_SECRET="your-regular-app-client-secret"

# Optional: Machine-to-Machine Application (for Management API)
AUTH0_M2M_CLIENT_ID="your-m2m-app-client-id"
AUTH0_M2M_CLIENT_SECRET="your-m2m-app-client-secret"
AUTH0_AUDIENCE="https://your-tenant.auth0.com/api/v2/"

# Connection names (optional, defaults shown)
AUTH0_CONNECTION_GOOGLE="google-oauth2"
AUTH0_CONNECTION_EMAIL="Username-Password-Authentication"
```

### 5. Database Migration

Run Prisma migration to add Auth0 fields:

```bash
cd apps/backend
bun run prisma:migrate dev --name add_auth0_support
```

This will add:
- `auth0Id` field to User model
- `provider` field updates

## API Endpoints

### ⚠️ Important: Free Tier Usage

For **free tier**, these endpoints work differently:

- **Frontend handles**: Signup and login with Auth0 SDK
- **Backend receives**: Auth0 access token from frontend
- **Backend verifies**: Token and syncs user to database

### Registration (Free Tier)

**Frontend Flow**:
1. User signs up using Auth0 SDK in frontend
2. Frontend gets Auth0 access token
3. Frontend calls `auth.googleLogin` with the access token
4. Backend verifies token and creates user in database

**Backend Endpoint** (Optional - only if M2M is configured):
- `auth.register` - Creates user in Auth0 from backend (requires Management API)

### Email/Password Login (Free Tier)

**Frontend Flow**:
1. User logs in using Auth0 SDK in frontend
2. Frontend gets Auth0 access token
3. Frontend calls `auth.googleLogin` with the access token
4. Backend verifies token and syncs user

**Backend Endpoint** (Optional - only if AUTH0_CLIENT_SECRET is configured):
- `auth.login` - Backend handles password grant (requires client secret)

### Google OAuth Login

**Endpoint**: `auth.googleLogin`

**Input**:
```typescript
{
  accessToken: string; // Auth0 access token from Google OAuth flow
}
```

**Response**: Same as registration

**Note**: Frontend should handle Google OAuth flow with Auth0 and send the resulting access token to this endpoint.

### Setup Password (for Google Users)

**Endpoint**: `auth.setupPassword`

**Requires**: Authentication (user must be logged in)

**Input**:
```typescript
{
  password: string; // min 8 characters
}
```

**Response**:
```typescript
{
  success: true;
  message: "Password set up successfully. You can now login with email and password.";
}
```

This allows Google users to also login with email/password.

## Duplicate Email Handling

The system automatically handles duplicate email scenarios:

### Scenario 1: User registers with email/password, then tries Google login

1. User registers with `user@example.com` and password
2. User later tries Google login with same email
3. System detects existing user by email
4. System links Google Auth0 account to existing user
5. User can now login with either method

### Scenario 2: User logs in with Google, then tries email/password login

1. User logs in with Google (`user@example.com`)
2. User later tries email/password login with same email
3. System detects existing user by email
4. System links email/password Auth0 account to existing user
5. User can now login with either method

### Scenario 3: User has both accounts in Auth0 (already linked)

If Auth0 accounts are already linked in Auth0 Dashboard, the system will use the primary account.

## User Provider Values

The `provider` field in the database can have these values:

- `auth0-email`: User registered/logged in with email/password
- `auth0-google`: User logged in with Google OAuth
- `auth0-google-email`: User logged in with Google and set up password (can use both methods)

## Frontend Integration

### Google OAuth Flow

```typescript
// Frontend should use Auth0 SDK
import { useAuth0 } from '@auth0/auth0-react';

const { loginWithRedirect, getAccessTokenSilently } = useAuth0();

// Login with Google
await loginWithRedirect({
  connection: 'google-oauth2',
});

// Get access token
const accessToken = await getAccessTokenSilently();

// Send to backend
await trpc.auth.googleLogin.mutate({ accessToken });
```

### Email/Password Flow (Free Tier)

```typescript
// Frontend handles Auth0 login
import { useAuth0 } from '@auth0/auth0-react';

const { loginWithPopup, getAccessTokenSilently } = useAuth0();

// Login with email/password
await loginWithPopup({
  connection: 'Username-Password-Authentication',
});

// Get access token
const accessToken = await getAccessTokenSilently();

// Send to backend for verification and user sync
await trpc.auth.googleLogin.mutate({ accessToken });
```

### Alternative: Backend Password Grant (Requires AUTH0_CLIENT_SECRET)

```typescript
// Only works if AUTH0_CLIENT_SECRET is configured
await trpc.auth.login.mutate({ email, password });
```

## Security Considerations

1. **Password Grant**: The password grant is enabled for backend convenience. In production, consider:
   - Using Authorization Code flow in frontend
   - Implementing rate limiting
   - Using Auth0's password policy

2. **Token Storage**: 
   - Access tokens are short-lived (15 minutes)
   - Refresh tokens are stored securely in database
   - Tokens are rotated on each refresh

3. **Account Linking**: 
   - Automatic linking prevents duplicate accounts
   - Users can access their account via any authentication method

4. **Email Verification**: 
   - Auth0 handles email verification
   - You can configure email templates in Auth0 Dashboard

## Troubleshooting

### "Auth0 not configured" error

- **Free tier**: Only `AUTH0_DOMAIN` is required
- Verify `AUTH0_DOMAIN` is set correctly
- For advanced features, check other Auth0 variables

### "Management API not available" error

- This means you're trying to use a feature that requires M2M application
- **Solution 1**: Create M2M application and add credentials
- **Solution 2**: Handle the operation in frontend instead

### "Invalid email or password" error

- Verify user exists in Auth0
- Check password policy requirements
- Ensure email/password connection is enabled

### "Email already registered" error

- User already exists in Auth0
- System will automatically link accounts if same email

### Google OAuth not working

- Verify Google OAuth connection is enabled in Auth0
- Check Google Cloud Console credentials
- Ensure callback URLs are configured correctly

### "NOT_IMPLEMENTED" errors

- These mean the feature requires Management API or client secret
- **Free tier solution**: Handle the operation in frontend using Auth0 SDK
- **Advanced solution**: Configure M2M application or client secret

## Free Tier Summary

### ✅ What Works with Just AUTH0_DOMAIN:

- ✅ Google OAuth login (frontend handles, backend verifies)
- ✅ Email/password login (frontend handles, backend verifies)
- ✅ User sync to database
- ✅ Duplicate email handling
- ✅ Token verification

### ❌ What Requires M2M Application:

- ❌ Backend user creation (`auth.register`)
- ❌ Backend password setup (`auth.setupPassword`)
- ❌ Backend user updates

### 💡 Free Tier Best Practice:

1. **Frontend**: Use Auth0 SDK for all authentication
2. **Backend**: Only verify tokens and sync users
3. **Result**: Works perfectly with free tier, no M2M needed!

## Migration from Firebase

The system maintains backward compatibility with Firebase authentication:

- Legacy Firebase endpoints still work (`firebaseLogin`, `firebaseRegister`)
- Existing users with `firebaseUid` can continue using Firebase
- New users should use Auth0 endpoints

To migrate existing users:
1. Export users from Firebase
2. Create corresponding Auth0 users (or let them sign up fresh)
3. Update database `auth0Id` and `provider` fields
4. Decommission Firebase authentication

## Related Documentation

- [Authentication Summary](./authentication-summary.md) - Token system overview
- [Environment Variables](../environment-variables.md) - Complete env var reference

