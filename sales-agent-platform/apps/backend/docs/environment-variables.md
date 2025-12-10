# Environment Variables

Configuration guide for environment variables in the backend.

## Required Variables

### `DATABASE_URL`
- **Type**: `string`
- **Description**: PostgreSQL database connection string
- **Example**: `postgresql://user:password@localhost:5432/dbname`
- **Required**: ✅ Yes

### `JWT_SECRET`
- **Type**: `string`
- **Description**: Secret key for signing JWT tokens
- **Example**: `your-secret-key-here`
- **Default**: `"your-secret-key"` (⚠️ Change in production!)
- **Required**: ✅ Yes (for production)

## Optional Variables

### `REFRESH_TOKEN_DAYS`
- **Type**: `number` (days)
- **Description**: Number of days before refresh tokens expire
- **Default**: `400` days
- **Example**: 
  - `400` - Refresh token valid for 400 days (default)
  - `365` - Refresh token valid for 1 year
  - `180` - Refresh token valid for 6 months
- **Required**: ❌ No
- **Important**: Must be longer than `INACTIVITY_LOGOUT_DAYS` for inactivity check to work

### `INACTIVITY_LOGOUT_DAYS`
- **Type**: `number` (days)
- **Description**: Number of days before inactive users are automatically logged out
- **Default**: `365` (1 year)
- **Example**: 
  - `365` - Logout after 1 year of inactivity (default)
  - `180` - Logout after 6 months of inactivity
  - `90` - Logout after 3 months of inactivity
  - `0` - Disable inactivity logout (not recommended)
- **Required**: ❌ No
- **Important**: Must be shorter than `REFRESH_TOKEN_DAYS` for the check to work

**How it works:**
- Users are logged out if they haven't logged in for this many days
- `lastLoginAt` is updated on every login and token refresh
- Check happens during token refresh and API requests
- Error message: `"Account inactive for over X days. Please login again."`
- **Requires**: `REFRESH_TOKEN_DAYS` to be longer than this value

### `LOG_LEVEL`
- **Type**: `string`
- **Description**: Logging level (debug, info, warn, error)
- **Default**: `"debug"` in development, `"info"` in production
- **Example**: 
  - `debug` - Log everything (development)
  - `info` - Log info, warnings, and errors (production)
  - `warn` - Log only warnings and errors
  - `error` - Log only errors
- **Required**: ❌ No

### `PORT`
- **Type**: `number`
- **Description**: Port number for the Express server
- **Default**: `3000`
- **Required**: ❌ No

## Firebase Configuration (for Google/Phone Login)

You can configure Firebase using either method:

### Method 1: Individual Variables

```env
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-client-email"
FIREBASE_PRIVATE_KEY="your-private-key"
```

### Method 2: Service Account JSON

```env
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
```

**Note**: If neither is configured, Google/Phone login will fail with an error.

## Example `.env` File

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# JWT Secret
JWT_SECRET="my-super-secret-jwt-key-change-in-production"

# Token Configuration (optional)
REFRESH_TOKEN_DAYS=400        # Refresh token expiry (default: 400 days)
INACTIVITY_LOGOUT_DAYS=365    # Inactivity logout period (default: 365 days)

# Firebase (optional, for Google/Phone login)
FIREBASE_PROJECT_ID="my-firebase-project"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@my-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Server Port (optional)
PORT=3000
```

## Configuration Examples

### Development
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myapp_dev"
JWT_SECRET="dev-secret-key"
REFRESH_TOKEN_DAYS=400
INACTIVITY_LOGOUT_DAYS=365
LOG_LEVEL=debug
PORT=3000
```

### Production
```env
DATABASE_URL="postgresql://user:secure-password@db.example.com:5432/myapp_prod"
JWT_SECRET="super-secure-random-key-min-32-chars"
REFRESH_TOKEN_DAYS=400
INACTIVITY_LOGOUT_DAYS=180  # 6 months for production
LOG_LEVEL=info
PORT=3000
```

### Staging
```env
DATABASE_URL="postgresql://user:password@staging-db.example.com:5432/myapp_staging"
JWT_SECRET="staging-secret-key"
REFRESH_TOKEN_DAYS=400
INACTIVITY_LOGOUT_DAYS=90  # 3 months for staging
LOG_LEVEL=info
PORT=3000
```

## Security Best Practices

### ✅ Do
- Use strong, random `JWT_SECRET` in production
- Keep `.env` file in `.gitignore`
- Use different values for dev/staging/production
- Rotate secrets regularly
- Use environment-specific inactivity periods

### ❌ Don't
- Commit `.env` files to git
- Use default `JWT_SECRET` in production
- Share secrets between environments
- Use short or predictable secrets
- Set `REFRESH_TOKEN_DAYS` shorter than `INACTIVITY_LOGOUT_DAYS`
- Disable inactivity logout (set to 0) in production

## Loading Environment Variables

The backend uses `dotenv` to load environment variables from `.env` file:

```typescript
// In src/index.ts
import dotenv from "dotenv";
dotenv.config();
```

Variables are loaded automatically when the server starts.

## Accessing Variables in Code

```typescript
// Direct access
const port = process.env.PORT || 3000;

// With type conversion
const inactivityDays = parseInt(process.env.INACTIVITY_LOGOUT_DAYS || "365", 10);
```

## Related Documentation

- [Logging System](./logging.md) - Complete logging documentation
- [Authentication System Summary](./auth/authentication-summary.md) - Complete overview of auth system (if exists)

