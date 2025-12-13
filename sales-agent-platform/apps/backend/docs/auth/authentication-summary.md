# Authentication System - Summary

## Overview

The backend uses **Auth0** for authentication with a **dual-token system**:
- **Auth0** handles Google OAuth and Email/Password authentication
- **Backend JWT** manages sessions (ongoing)
- **Legacy Firebase** support maintained for migration period

## Token System

### Access Token
- **Expiry**: 15 minutes
- **Purpose**: Short-lived token for API requests
- **Auto-refresh**: Mobile app automatically refreshes when expired

### Refresh Token
- **Expiry**: 400 days (configurable via `REFRESH_TOKEN_DAYS`)
- **Purpose**: Long-lived token to get new access tokens
- **Storage**: Database (`UserRefreshToken` table)
- **Default**: 400 days (longer than inactivity period to allow inactivity check)

### Inactivity Check
- **Period**: 365 days (configurable via `INACTIVITY_LOGOUT_DAYS`)
- **Purpose**: Logout users who haven't logged in for extended period
- **Default**: 1 year

## How It Works

### Active Users
```
User logs in → Gets access token (15min) + refresh token (400 days)
    ↓
User uses app → Access token expires every 15 min
    ↓
Mobile app auto-refreshes → Gets new access token
    ↓
lastLoginAt updated on each refresh
    ↓
User stays logged in as long as they use app ✅
```

### Inactive Users
```
User logs in → Gets tokens, lastLoginAt = today
    ↓
User doesn't use app for 1+ year
    ↓
User tries to use app → Token refresh attempted
    ↓
Backend checks:
  1. Refresh token expired? (400 days) → NO (still valid)
  2. User inactive 1 year? → YES (lastLoginAt > 1 year ago)
    ↓
Token refresh rejected
Error: "Account inactive for over 365 days. Please login again."
    ↓
User must login again ✅
```

## Configuration

### Environment Variables

```env
# Refresh token expiry (days)
# Default: 400 days (must be longer than INACTIVITY_LOGOUT_DAYS)
REFRESH_TOKEN_DAYS=400

# Inactivity logout period (days)
# Default: 365 days (1 year)
INACTIVITY_LOGOUT_DAYS=365

# JWT Secret
JWT_SECRET="your-secret-key"
```

### Important Notes

1. **`REFRESH_TOKEN_DAYS` must be longer than `INACTIVITY_LOGOUT_DAYS`**
   - If refresh token expires first, inactivity check never runs
   - Default: 400 days > 365 days ✅

2. **`lastLoginAt` is updated on**:
   - Every login (all login methods)
   - Every successful token refresh (user is active)

3. **Inactivity check happens in**:
   - `refreshToken` function (when mobile app tries to refresh)
   - `context.ts` (on every API request for extra security)

## Token Expiry Flow

```
User makes API request
    ↓
Access token expired? (15 min)
    ↓
YES → Mobile app auto-refreshes
    ↓
Backend refreshToken() checks:
    1. Refresh token exists? ✅
    2. Refresh token revoked? ✅
    3. Refresh token expired? (400 days) ✅
    4. User inactive? (365 days) ✅
    ↓
All checks pass → Update lastLoginAt + Issue new tokens
    ↓
User continues using app ✅
```

## Summary Table

| Time Period | Default | Configurable | Effect |
|------------|---------|-------------|--------|
| **Access Token** | 15 minutes | ❌ No | Auto-refreshes when using app |
| **Refresh Token** | 400 days | ✅ Yes (`REFRESH_TOKEN_DAYS`) | Users stay logged in longer |
| **Inactivity Check** | 365 days | ✅ Yes (`INACTIVITY_LOGOUT_DAYS`) | Catches abandoned accounts |

## Security Features

✅ **Short-lived access tokens** (15 min) - Limits damage if stolen
✅ **Long-lived refresh tokens** (400 days) - Better UX for mobile apps
✅ **Token rotation** - Refresh tokens are rotated on each use
✅ **Single session enforcement** - One active session per user
✅ **Inactivity logout** - Abandoned accounts are logged out
✅ **Session revocation** - Logout actually revokes tokens
✅ **Expiry validation** - Multiple expiry checks in place

## Best Practices

### ✅ Do
- Keep `REFRESH_TOKEN_DAYS` longer than `INACTIVITY_LOGOUT_DAYS`
- Use strong `JWT_SECRET` in production
- Rotate secrets regularly
- Monitor inactive accounts

### ❌ Don't
- Set `REFRESH_TOKEN_DAYS` shorter than `INACTIVITY_LOGOUT_DAYS`
- Use default `JWT_SECRET` in production
- Disable inactivity check (set to 0)
- Share secrets between environments

## Related Documentation

- [Environment Variables](./environment-variables.md) - Complete env var reference

---

**TL;DR**: Refresh tokens expire at 400 days (configurable), inactivity check at 365 days (configurable). Users stay logged in as long as they use the app, and are logged out if inactive for 1+ year. 🎯
