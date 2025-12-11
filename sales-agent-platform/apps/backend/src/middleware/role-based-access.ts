/**
 * Role-based access control middleware
 */

import { TRPCError } from "@trpc/server";
import type { AnyMiddlewareFunction } from "@trpc/server";
import { USER_ROLES } from "../constants/user";

/**
 * Middleware to ensure user has super admin role
 */
export const requireSuperAdmin: AnyMiddlewareFunction = async ({ ctx, next }) => {
  if (ctx.user?.role !== USER_ROLES.SUPER_ADMIN) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Super admin access required",
    });
  }
  return next();
};

/**
 * Middleware to ensure user has company admin role
 */
export const requireCompanyAdmin: AnyMiddlewareFunction = async ({ ctx, next }) => {
  if (ctx.user?.role !== USER_ROLES.COMPANY_ADMIN) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Company admin access required",
    });
  }
  return next();
};

/**
 * Middleware to ensure user is company admin or super admin
 */
export const requireAdmin: AnyMiddlewareFunction = async ({ ctx, next }) => {
  if (
    ctx.user?.role !== USER_ROLES.COMPANY_ADMIN &&
    ctx.user?.role !== USER_ROLES.SUPER_ADMIN
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next();
};

/**
 * Middleware to ensure user is company user (agent)
 */
export const requireCompanyUser: AnyMiddlewareFunction = async ({ ctx, next }) => {
  if (ctx.user?.role !== USER_ROLES.COMPANY_USER) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Company user access required",
    });
  }
  return next();
};

