# Express + tRPC + Prisma Backend Template

This is a template for a backend application using Express.js, tRPC, and Prisma ORM.

## Features

- Express.js server
- tRPC for type-safe API endpoints
- Prisma ORM for database operations
- PostgreSQL database
- TypeScript support
- Sample CRUD operations for Users and Posts

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure your database and environment variables:
- Copy the environment template:
  ```bash
  cp .env.template .env
  ```
- Edit `.env` and fill in your values (see `.env.template` for all available options)
- **Required**: Set `DATABASE_URL` and `JWT_SECRET`
- Make sure your database is running

3. Run database migrations:
```bash
npm run prisma:migrate
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

## Development

Start the development server:
```bash
npm run dev
```

The server will start on port 3000 (or the port specified in your .env file).

## API Endpoints

The API is available at `/trpc` and includes the following routes:

### Users
- `user.create` - Create a new user
- `user.getAll` - Get all users
- `user.getById` - Get user by ID
- `user.update` - Update user
- `user.delete` - Delete user

### Posts
- `post.create` - Create a new post
- `post.getAll` - Get all posts
- `post.getById` - Get post by ID
- `post.update` - Update post
- `post.delete` - Delete post

## Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```
