import { TRPCError } from "@trpc/server";
import type { AnyMiddlewareFunction } from "@trpc/server";
import { logger } from "../utils/logger";

export const isAuthenticated: AnyMiddlewareFunction = async ({ ctx, next }) => {
  if (!ctx.user) {
    logger.warn("Authentication failed", { userId: null });
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }
  
  logger.debug("Authentication successful", { userId: ctx.user.id });
  return next();
};
