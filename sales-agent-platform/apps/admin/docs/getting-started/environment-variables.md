# Environment Variables

Configuration guide for environment variables in the admin app.

## Overview

Environment variables are used to configure the app without hardcoding values. They can be set in `.env` files or through your deployment platform.

## Available Variables

### API Configuration

#### `API_BASE_URL`
- **Type**: `string`
- **Default**: `http://localhost:3000`
- **Description**: Base URL for the backend API
- **Example**: `API_BASE_URL=https://api.example.com`

**Usage in code:**
```typescript
const config = useRuntimeConfig()
const apiBase = config.public.apiBase
```

## Environment File Setup

### Development

Create a `.env` file in `apps/admin/`:

```env
# API Configuration
API_BASE_URL=http://localhost:3000
```

### Production

Set environment variables in your hosting platform:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Docker**: Use `-e` flag or `.env` file
- **Kubernetes**: Use ConfigMaps or Secrets

## Runtime Configuration

Environment variables are accessed through Nuxt's runtime config:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3000',
    },
  },
})
```

## Usage in Components

```vue
<script setup lang="ts">
const config = useRuntimeConfig()
const apiUrl = config.public.apiBase

// Use in API calls
const response = await fetch(`${apiUrl}/api/endpoint`)
</script>
```

## Security Best Practices

### ✅ Do
- Use environment variables for sensitive data
- Keep `.env` files in `.gitignore`
- Use different values for dev/staging/production
- Document all environment variables

### ❌ Don't
- Commit `.env` files to git
- Hardcode API URLs or secrets
- Expose sensitive variables to client-side
- Use production values in development

## Adding New Variables

1. **Add to `nuxt.config.ts`:**
   ```typescript
   runtimeConfig: {
     public: {
       apiBase: process.env.API_BASE_URL || 'http://localhost:3000',
       newVar: process.env.NEW_VAR || 'default',
     },
   }
   ```

2. **Update this documentation** with the new variable

3. **Add to `.env.example`** (if you maintain one)

4. **Update deployment configs** for all environments

## Troubleshooting

### Variable Not Available

**Problem**: Environment variable is `undefined`

**Solutions**:
1. Restart dev server after adding variables
2. Check variable name matches exactly
3. Verify `.env` file is in correct location
4. Check `nuxt.config.ts` configuration

### Wrong Value in Production

**Problem**: Production uses wrong environment variable

**Solutions**:
1. Check deployment platform settings
2. Verify variable names match
3. Check for typos in variable names
4. Restart deployment after changes

## Related Documentation

- [Installation](./installation.md) - Setup guide
- [Deployment](../deployment/README.md) - Production deployment
- [Troubleshooting](./troubleshooting.md) - Common issues

