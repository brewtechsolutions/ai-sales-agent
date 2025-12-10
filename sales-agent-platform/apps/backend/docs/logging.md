# Logging System

## Overview

The backend includes a comprehensive logging system that logs:
- HTTP requests and responses
- tRPC procedure calls and results
- Authentication events
- Errors and warnings

## Logger Features

- **Log Levels**: `debug`, `info`, `warn`, `error`
- **Structured Logging**: JSON-formatted data with timestamps
- **Request/Response Logging**: HTTP method, path, status, duration
- **tRPC Logging**: Procedure names, success/failure, duration
- **Configurable**: Log level controlled via environment variable

## Configuration

### Environment Variables

```env
# Log Level (debug, info, warn, error)
# Default: "debug" in development, "info" in production
LOG_LEVEL=info

# Node Environment
NODE_ENV=production
```

### Log Levels

| Level | Description | When to Use |
|-------|-------------|-------------|
| `debug` | Detailed debugging information | Development only |
| `info` | General informational messages | Normal operations |
| `warn` | Warning messages | Non-critical issues |
| `error` | Error messages | Failures and exceptions |

## What Gets Logged

### HTTP Requests

Every HTTP request is logged with:
- Method (GET, POST, etc.)
- URL and path
- IP address
- User agent
- Response status code
- Request duration

**Example:**
```
[2024-01-15T10:30:45.123Z] [INFO] HTTP Request {"method":"POST","url":"/trpc/auth.googleLogin","path":"/trpc/auth.googleLogin","ip":"::1","userAgent":"Mozilla/5.0..."}
[2024-01-15T10:30:45.456Z] [INFO] HTTP Response {"method":"POST","url":"/trpc/auth.googleLogin","path":"/trpc/auth.googleLogin","statusCode":200,"duration":"333ms"}
```

### tRPC Procedures

Every tRPC procedure call is logged with:
- Procedure name (e.g., `mutation.auth.googleLogin`)
- User ID (if authenticated)
- Success/failure status
- Duration
- Error details (if failed)

**Example:**
```
[2024-01-15T10:30:45.123Z] [DEBUG] tRPC Procedure Call {"procedure":"mutation.auth.googleLogin","userId":"user-123"}
[2024-01-15T10:30:45.456Z] [INFO] tRPC Procedure Result {"procedure":"mutation.auth.googleLogin","success":true,"duration":"333ms"}
```

### Authentication Events

Authentication middleware logs:
- Successful authentications
- Failed authentication attempts

**Example:**
```
[2024-01-15T10:30:45.123Z] [DEBUG] Authentication successful {"userId":"user-123"}
[2024-01-15T10:30:45.123Z] [WARN] Authentication failed {"userId":null}
```

## Usage in Code

### Basic Logging

```typescript
import { logger } from "../utils/logger";

// Debug (development only)
logger.debug("Processing request", { requestId: "123" });

// Info (general information)
logger.info("User logged in", { userId: "user-123" });

// Warning
logger.warn("Rate limit approaching", { userId: "user-123", requests: 95 });

// Error
logger.error("Database connection failed", error, { host: "db.example.com" });
```

### HTTP Request Logging

The `requestLogger` middleware automatically logs all HTTP requests:

```typescript
// In index.ts
import { requestLogger } from "./middleware/logger";
app.use(requestLogger);
```

### tRPC Procedure Logging

The `loggingMiddleware` automatically logs all tRPC procedures:

```typescript
// In trpc.ts
export const publicProcedure = t.procedure.use(loggingMiddleware);
export const protectedProcedure = t.procedure.use(isAuthenticated).use(loggingMiddleware);
```

## Log Output Examples

### Development (LOG_LEVEL=debug)

```
[2024-01-15T10:30:45.123Z] [DEBUG] tRPC Procedure Call {"procedure":"mutation.auth.googleLogin","input":{"idToken":"..."},"userId":null}
[2024-01-15T10:30:45.123Z] [INFO] HTTP Request {"method":"POST","url":"/trpc/auth.googleLogin","path":"/trpc/auth.googleLogin","ip":"::1"}
[2024-01-15T10:30:45.456Z] [INFO] tRPC Procedure Result {"procedure":"mutation.auth.googleLogin","success":true,"duration":"333ms"}
[2024-01-15T10:30:45.456Z] [INFO] HTTP Response {"method":"POST","url":"/trpc/auth.googleLogin","statusCode":200,"duration":"333ms"}
```

### Production (LOG_LEVEL=info)

```
[2024-01-15T10:30:45.123Z] [INFO] HTTP Request {"method":"POST","url":"/trpc/auth.googleLogin","path":"/trpc/auth.googleLogin","ip":"192.168.1.1"}
[2024-01-15T10:30:45.456Z] [INFO] tRPC Procedure Result {"procedure":"mutation.auth.googleLogin","success":true,"duration":"333ms"}
[2024-01-15T10:30:45.456Z] [INFO] HTTP Response {"method":"POST","url":"/trpc/auth.googleLogin","statusCode":200,"duration":"333ms"}
```

## Log Files

Currently, logs are output to `console` (stdout/stderr). For production, you can:

1. **Redirect to file**: `node dist/index.js > logs/app.log 2>&1`
2. **Use process manager**: PM2, systemd, etc. can handle log rotation
3. **Upgrade to winston/pino**: Replace logger utility with proper logging library

## Best Practices

### ✅ Do
- Use appropriate log levels
- Include relevant context in log data
- Log errors with full error objects
- Use structured logging (JSON data)
- Set `LOG_LEVEL=info` in production

### ❌ Don't
- Log sensitive data (passwords, tokens, etc.)
- Use `console.log` directly (use logger instead)
- Log too much in production (use `info` level)
- Log user input in production (only in development)

## Upgrading to Winston/Pino

The current logger is simple but effective. To upgrade to a proper logging library:

### Option 1: Winston

```bash
npm install winston
```

```typescript
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

### Option 2: Pino

```bash
npm install pino
```

```typescript
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});
```

The current logger interface is designed to be easily replaceable with these libraries.

## Related Files

- `src/utils/logger.ts` - Logger utility
- `src/middleware/logger.ts` - HTTP request logging middleware
- `src/trpc/trpc.ts` - tRPC procedure logging middleware
- `src/middleware/auth.ts` - Authentication logging

---

**TL;DR**: Comprehensive logging for HTTP requests, tRPC procedures, and authentication events. Configurable via `LOG_LEVEL` environment variable. 🎯

