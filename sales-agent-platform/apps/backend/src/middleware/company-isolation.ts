/**
 * Company isolation middleware
 * Ensures all queries are filtered by company_id (except super_admin)
 */

import { TRPCError } from "@trpc/server";
import type { AnyMiddlewareFunction } from "@trpc/server";
import { USER_ROLES } from "../constants/user";

export const companyIsolation: AnyMiddlewareFunction = async ({ ctx, next }) => {
  // Super admin can access all companies
  if (ctx.user?.role === USER_ROLES.SUPER_ADMIN) {
    return next({
      ctx: {
        ...ctx,
        companyId: undefined, // Super admin has no company restriction
      },
    });
  }

  // All other users must have a company_id
  if (!ctx.user?.companyId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User must belong to a company",
    });
  }

  return next({
    ctx: {
      ...ctx,
      companyId: ctx.user.companyId, // Inject company_id for filtering
    },
  });
};

