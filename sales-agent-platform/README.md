# Iris Agent App - Monorepo

A full-stack monorepo featuring an admin dashboard, backend API, and mobile app, all sharing type-safe APIs through tRPC.

## ⚡ Quick Commands

```bash
# Install dependencies
bun install

# Start all apps
bun run dev

# Start individual apps (recommended)
bun run dev:backend    # Backend API (port 3000)
bun run dev:admin      # Admin dashboard (port 5173)
bun run dev:mobile     # Mobile app (Expo)

# Build all apps
bun run build

# Build individual apps
bun run build:backend
bun run build:admin
bun run build:mobile
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18
- **Bun** >= 1.2.12 ([Installation Guide](https://bun.sh/docs/installation))
- **Git** for version control

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd iris-agent-app
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Set up environment variables:**
   - Backend: Create `.env` in `apps/backend/` (see [Backend README](./apps/backend/README.md))
   - Admin: Create `.env` in `apps/admin/` if needed
   - Mobile: Create `.env` in `apps/mobile/` if needed

4. **Set up database (Backend):**
   ```bash
   cd apps/backend
   bun run prisma:generate
   bun run prisma:migrate
   bun run prisma:seed
   ```

5. **Start development servers:**
   ```bash
   # Option 1: Start all apps at once
   bun run dev

   # Option 2: Start individual apps (recommended)
   bun run dev:backend    # Backend API (port 3000)
   bun run dev:admin      # Admin dashboard (port 5173)
   bun run dev:mobile     # Mobile app (Expo)

   # Option 3: Using Turborepo filter directly
   turbo run dev --filter=backend
   turbo run dev --filter=template-trpc-admin
   turbo run dev --filter=mobile

   # Option 4: Navigate to app directory
   cd apps/backend && bun run dev
   cd apps/admin && bun run dev
   cd apps/mobile && bun run dev
   ```

## 📦 What's Inside?

This monorepo includes the following apps and packages:

### Apps

#### `apps/admin` - Admin Dashboard
- **Framework**: Nuxt 3
- **UI**: Nuxt UI + Tailwind CSS
- **Features**: 
  - iOS-inspired design with semantic colors
  - Full dark mode support
  - Authentication system
  - Product & User management
  - Responsive design
- **Port**: 5173
- **Documentation**: [apps/admin/docs](./apps/admin/docs/README.md)

#### `apps/backend` - Backend API
- **Framework**: Express + tRPC
- **Database**: Prisma + PostgreSQL
- **Features**:
  - Type-safe API with tRPC
  - Authentication (JWT)
  - Product & User management
  - Database migrations
- **Port**: 3000
- **Documentation**: [apps/backend/README.md](./apps/backend/README.md)

#### `apps/mobile` - Mobile App
- **Framework**: React Native + Expo
- **UI**: NativeWind (Tailwind CSS) + React Native Elements
- **Features**:
  - Cross-platform (iOS & Android)
  - Multi-language support (English, Chinese)
  - Dark mode support
  - Authentication
  - Product management
- **Documentation**: [apps/mobile/docs](./apps/mobile/docs/README.md)

### Packages

#### `packages/ui` - Shared UI Components
- React component library
- Shared across web applications

#### `packages/eslint-config` - ESLint Configuration
- Shared ESLint configs for all apps
- Includes base, Next.js, and React configs

#### `packages/typescript-config` - TypeScript Configuration
- Shared TypeScript configs
- Base, Next.js, and React library configs

## 🛠️ Tech Stack

### Frontend
- **Admin**: Nuxt 3, Vue 3, Tailwind CSS, Nuxt UI
- **Mobile**: React Native, Expo, NativeWind, React Native Elements

### Backend
- **API**: Express, tRPC
- **Database**: Prisma, PostgreSQL
- **Auth**: JWT, Argon2/Bcrypt

### Development
- **Monorepo**: Turborepo
- **Package Manager**: Bun
- **Language**: TypeScript
- **Code Quality**: ESLint, Prettier

### State Management
- **Admin**: Zustand (for global state)
- **Mobile**: Zustand (for global state)
- **Server State**: tRPC + React Query/TanStack Query

## 📋 Available Scripts

### Root Level

```bash
# Development - All Apps
bun run dev              # Start all apps in development mode

# Development - Individual Apps (Quick Start)
bun run dev:backend      # Start backend only
bun run dev:admin        # Start admin dashboard only
bun run dev:mobile       # Start mobile app only

# Build - All Apps
bun run build            # Build all apps and packages

# Build - Individual Apps
bun run build:backend   # Build backend only
bun run build:admin      # Build admin only
bun run build:mobile     # Build mobile only

# Code Quality
bun run lint             # Lint all apps and packages
bun run format           # Format code with Prettier
bun run check-types      # Type check all apps

# Dependencies
bun run upgrade          # Safe upgrade (within semver ranges)
bun run upgrade:latest   # Upgrade to latest versions (may break)
```

### Using Turborepo Filters

You can also use Turborepo's `--filter` flag directly:

```bash
# Development
turbo run dev --filter=backend              # Backend only
turbo run dev --filter=template-trpc-admin  # Admin only
turbo run dev --filter=mobile               # Mobile only

# Build
turbo run build --filter=backend
turbo run build --filter=template-trpc-admin
turbo run build --filter=mobile

# Lint
turbo run lint --filter=backend
turbo run lint --filter=template-trpc-admin
turbo run lint --filter=mobile
```

### App-Specific

```bash
# Backend
cd apps/backend
bun run dev              # Start development server
bun run build            # Build for production
bun run prisma:generate  # Generate Prisma client
bun run prisma:migrate   # Run database migrations
bun run prisma:seed      # Seed database

# Admin
cd apps/admin
bun run dev              # Start Nuxt dev server (port 5173)
bun run build            # Build for production
bun run generate         # Generate static site

# Mobile
cd apps/mobile
bun run dev              # Start Expo dev server
bun run ios              # Run on iOS simulator
bun run android          # Run on Android emulator
bun run web              # Run in web browser
```

## 🏗️ Project Structure

```
iris-agent-app/
├── apps/
│   ├── admin/          # Nuxt 3 admin dashboard
│   ├── backend/        # Express + tRPC backend
│   └── mobile/         # React Native mobile app
├── packages/
│   ├── ui/             # Shared UI components
│   ├── eslint-config/  # Shared ESLint configs
│   └── typescript-config/ # Shared TypeScript configs
├── package.json        # Root package.json
├── turbo.json          # Turborepo configuration
└── README.md          # This file
```

## 🚦 Getting Started Guide

### 1. First Time Setup

```bash
# 1. Install dependencies
bun install

# 2. Set up backend database
cd apps/backend
bun run prisma:generate
bun run prisma:migrate
bun run prisma:seed

# 3. Start all services
cd ../..
bun run dev
```

### 2. Access the Apps

- **Admin Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Mobile App**: Use Expo Go app to scan QR code

### 3. Development Workflow

**Recommended: Start Backend First**

```bash
# Terminal 1: Start backend
bun run dev:backend

# Terminal 2: Start admin or mobile
bun run dev:admin    # For admin dashboard
# OR
bun run dev:mobile   # For mobile app
```

**Alternative: Start All at Once**

```bash
# Starts all apps simultaneously
bun run dev
```

**Using Turborepo Filters**

```bash
# Start specific app with dependencies
turbo run dev --filter=admin --filter=backend
turbo run dev --filter=mobile --filter=backend
```

## 📚 Documentation

### App-Specific Documentation

- **Admin App**: [apps/admin/docs](./apps/admin/docs/README.md)
  - [Getting Started](./apps/admin/docs/getting-started/README.md)
  - [Components](./apps/admin/docs/components/README.md)
  - [AI Agent Rules](./apps/admin/docs/agent-rule/README.md)
  
- **Mobile App**: [apps/mobile/docs](./apps/mobile/docs/README.md)
  - [AI Agent Rules](./apps/mobile/docs/agent-rule/README.md)
  - [Localization](./apps/mobile/docs/localization/README.md)

- **Backend**: [apps/backend/README.md](./apps/backend/README.md)

### Coding Standards

- **Admin App Rules**: [apps/admin/docs/agent-rule/README.md](./apps/admin/docs/agent-rule/README.md)
- **Mobile App Rules**: [apps/mobile/docs/agent-rule/README.md](./apps/mobile/docs/agent-rule/README.md)
- **Documentation Rules**: [DOCUMENTATION_RULES.md](./DOCUMENTATION_RULES.md)

## 🔧 Configuration

### Environment Variables

Each app may have its own `.env` file. See:
- [Backend Environment Setup](./apps/backend/README.md#environment-variables)
- [Admin Environment Variables](./apps/admin/docs/getting-started/environment-variables.md)
- [Mobile Environment Variables](./apps/mobile/docs/getting-started/environment-variables.md) (if applicable)

### Package Manager

This monorepo uses **Bun** as the package manager. All commands should use `bun`:

```bash
bun install    # Install dependencies
bun run dev    # Run scripts
bun add <pkg>  # Add dependency
```

## 🧪 Testing

```bash
# Run tests (when configured)
bun run test

# Type checking
bun run check-types

# Linting
bun run lint
```

## 🚀 Deployment

### Build for Production

```bash
# Build all apps
bun run build

# Or build individually
cd apps/backend && bun run build
cd apps/admin && bun run build
cd apps/mobile && bun run build
```

### Deployment Targets

- **Backend**: Deploy to your server (Node.js environment)
- **Admin**: Deploy to Vercel, Netlify, or any static hosting
- **Mobile**: Build with EAS Build or Expo Build

## 🔄 Dependency Management

### Safe Upgrade (Recommended)
```bash
bun run upgrade
```
Updates dependencies to latest compatible versions within semver ranges.

### Latest Versions (Use with Caution)
```bash
bun run upgrade:latest
```
Upgrades to absolute latest versions (may include breaking changes).

See [UPGRADE_GUIDE.md](./UPGRADE_GUIDE.md) for detailed information.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes following the coding standards
3. Run linting and type checking: `bun run lint && bun run check-types`
4. Test your changes
5. Submit a pull request

### Coding Standards

- Follow the AI agent rules in each app's `docs/agent-rule/` directory
- Use semantic colors (no hardcoded colors)
- Support dark mode
- Use i18n for all user-facing text (mobile)
- Use Zustand for global state management
- Follow TypeScript best practices

## 📖 Learn More

- [Turborepo Documentation](https://turborepo.com/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Expo Documentation](https://docs.expo.dev)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🆘 Troubleshooting

### Common Issues

**Problem**: Dependencies not installing
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install
```

**Problem**: Database connection errors
```bash
# Solution: Check .env file in apps/backend/
# Ensure DATABASE_URL is set correctly
```

**Problem**: Port already in use
```bash
# Solution: Change port in app config files
# Backend: apps/backend/src/index.ts
# Admin: apps/admin/nuxt.config.ts
```

For more help, check:
- [Admin Troubleshooting](./apps/admin/docs/getting-started/troubleshooting.md)
- [Backend README](./apps/backend/README.md)

## 📝 License

[Add your license here]

---

**Happy coding! 🎉**
