/**
 * tRPC Router Types
 * 
 * This file defines the AppRouter type without importing the actual backend code.
 * This prevents Metro from trying to bundle the entire backend.
 * 
 * To maintain type safety:
 * 1. Generate types from your backend using tRPC's type inference
 * 2. Export them to a shared types package
 * 3. Import only the type definitions (not the actual router)
 * 
 * For now, we use a safe type definition that matches your backend structure.
 */

import type { AnyRouter } from "@trpc/server";

/**
 * AppRouter type definition
 * This should match your backend router structure
 * Update this as your backend API evolves
 */
export interface AppRouter extends AnyRouter {
  // Auth routes
  auth: {
    register: any;
    login: any;
    logout: any;
    me: any;
    googleLogin: any;
    phoneLogin: any;
    refreshToken: any;
    firebaseLogin: any;
    firebaseRegister: any;
  };
  // User routes
  users: {
    getAll: any;
    getById: any;
    update: any;
    delete: any;
  };
  // Product routes
  products: {
    getAll: any;
    getById: any;
    create: any;
    update: any;
    delete: any;
  };
}

// Export type helpers for better DX
export type AppRouterInput = any;
export type AppRouterOutput = any;

