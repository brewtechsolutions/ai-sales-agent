# Quick Start

Get up and running with the admin app in 5 minutes!

## Step 1: Install Dependencies

```bash
cd apps/admin
bun install
```

## Step 2: Start Development Server

```bash
bun run dev
```

## Step 3: Open in Browser

Navigate to [http://localhost:5173](http://localhost:5173)

## Step 4: Explore the App

### Available Pages

- **Login**: `/auth/login` - User authentication
- **Register**: `/auth/register` - Create new account
- **Dashboard**: `/` - Main dashboard with stats
- **Products**: `/products` - Product management
- **Users**: `/users` - User management

### Key Features to Try

1. **Authentication**
   - Register a new account
   - Login with credentials
   - Logout functionality

2. **Dashboard**
   - View statistics cards
   - Check recent activity
   - Navigate between sections

3. **Data Management**
   - View data tables
   - Create new items
   - Edit existing items
   - Delete items

4. **Responsive Design**
   - Resize browser window
   - Test mobile sidebar
   - Check dark mode (if implemented)

## Common Commands

```bash
# Development
bun run dev          # Start dev server
bun run build        # Build for production
bun run lint         # Run linter
bun run check-types  # Type check

# Testing (if configured)
bun run test         # Run tests
bun run test:watch   # Watch mode
```

## Next Steps

- Read [Component Documentation](../components/README.md) to understand available components
- Check [Design System](../design-system/README.md) for styling guidelines
- Review [Architecture](../architecture/README.md) to understand the structure
- See [Troubleshooting](./troubleshooting.md) if you encounter issues

## Need Help?

- Check [Troubleshooting](./troubleshooting.md) for common issues
- Review [Installation Guide](./installation.md) if setup fails
- See [Environment Variables](./environment-variables.md) for configuration

