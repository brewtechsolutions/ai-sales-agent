# Installation

This guide will walk you through installing and setting up the admin app.

## Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18 ([Download](https://nodejs.org/))
- **Bun** >= 1.2.12 ([Installation Guide](https://bun.sh/docs/installation))
- **Git** ([Download](https://git-scm.com/))

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd iris-agent-app
```

### 2. Install Dependencies

From the root of the monorepo:

```bash
bun install
```

This will install dependencies for all apps and packages in the monorepo.

### 3. Navigate to Admin App

```bash
cd apps/admin
```

### 4. Verify Installation

Check that all dependencies are installed:

```bash
bun run dev
```

If the development server starts without errors, installation is complete!

## Environment Setup

### Environment Variables

Create a `.env` file in `apps/admin/` (if needed):

```env
# API Configuration
API_BASE_URL=http://localhost:3000

# Add other environment variables as needed
```

See [Environment Variables](./environment-variables.md) for detailed configuration.

## Development Server

Start the development server:

```bash
bun run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

## Build for Production

```bash
bun run build
```

The built files will be in the `.output` directory.

## Troubleshooting

### Installation Issues

**Problem**: `bun: command not found`
**Solution**: Install Bun following the [official guide](https://bun.sh/docs/installation)

**Problem**: Dependency installation fails
**Solution**: 
1. Clear cache: `bun pm cache rm`
2. Delete `node_modules` and `bun.lockb`
3. Run `bun install` again

**Problem**: Port 5173 already in use
**Solution**: Change the port in `nuxt.config.ts`:
```typescript
devServer: {
  port: 5174, // Change to available port
}
```

## Next Steps

- [Quick Start Guide](./quick-start.md) - Get started in 5 minutes
- [Environment Variables](./environment-variables.md) - Configure your environment
- [Architecture Overview](../architecture/README.md) - Understand the structure

