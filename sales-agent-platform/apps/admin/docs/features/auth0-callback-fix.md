# Auth0 Callback URL Mismatch - Quick Fix

## Error Message
```
Callback URL mismatch.
The provided redirect_uri is not in the list of allowed callback URLs.
```

## Solution

### Step 1: Check Your Current Callback URL

The frontend uses this callback URL format:
```
http://localhost:5173/auth/callback
```

Or in production:
```
https://yourdomain.com/auth/callback
```

### Step 2: Update Auth0 Settings

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → Your Application
3. Go to **Settings**
4. Find **Allowed Callback URLs**
5. Add these URLs (one per line):
   ```
   http://localhost:5173/auth/callback
   https://yourdomain.com/auth/callback
   ```
6. **Important**: Make sure the URL is exactly `/auth/callback` (not `/callback`)
7. Click **Save Changes**

### Step 3: Verify

- The callback URL must match EXACTLY
- No trailing slashes
- Include the `/auth/` prefix
- Use `http://` for localhost, `https://` for production

### Common Mistakes

❌ Wrong:
- `http://localhost:5173/callback` (missing `/auth/`)
- `http://localhost:5173/auth/callback/` (trailing slash)
- `http://localhost:5173/auth/callbacks` (typo)

✅ Correct:
- `http://localhost:5173/auth/callback`

### For Production

When deploying, make sure to:
1. Add your production domain to **Allowed Callback URLs**
2. Add your production domain to **Allowed Logout URLs**
3. Add your production domain to **Allowed Web Origins**

Example:
```
https://app.yourdomain.com/auth/callback
https://app.yourdomain.com
https://app.yourdomain.com
```

