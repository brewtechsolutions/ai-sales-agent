# AI Agent Coding Rules - Backend

This directory contains the coding rules and standards that AI assistants should follow when working on the backend (Express + tRPC + Prisma).

## Quick Links

- [Core Coding Rules](./core-rules.md) - Essential coding standards
- [API Standards](./api-standards.md) - tRPC API design guidelines
- [Database Standards](./database-standards.md) - Prisma and database best practices

## Overview

These rules ensure consistent, maintainable, and type-safe backend code that follows best practices. AI assistants should strictly adhere to these rules when:

- Creating new API endpoints
- Modifying existing code
- Defining database schemas
- Writing business logic
- Reviewing code

## Core Principles

1. **No Hardcoded Values** - Always use enums or constants
2. **DTOs Required** - All data structures must be defined as schemas/DTOs
3. **Type Safety First** - Full TypeScript types for all code
4. **Zod for Validation** - Use Zod schemas for all inputs
5. **Prisma for Database** - Use Prisma ORM for all database operations
6. **tRPC for APIs** - Use tRPC for type-safe API endpoints
7. **Code Reusability** - Always check for existing functions before writing new code (DRY principle)

## Quick Reference

### ❌ Never Do This
```typescript
// Hardcoded values
if (status === "active") { ... }

// Inline types
function createUser(body: { name: string; email: string }) { ... }

// Inline schema
.input(z.object({ page: z.number() }))

// Duplicated code
function getDate() { /* same logic in multiple files */ }
```

### ✅ Always Do This
```typescript
// Enums/constants
if (status === UserStatus.ACTIVE) { ... }

// Defined DTOs
function createUser(body: CreateUserDto) { ... }

// Defined schemas
.input(paginationSchema)

// Reusable utilities
import { getDate } from "@/utils/dates";
const date = getDate();
```

