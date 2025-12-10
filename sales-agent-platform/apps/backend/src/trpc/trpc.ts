import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import superjson from "superjson";
import { logger } from "../utils/logger";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

import { isAuthenticated } from "../middleware/auth";

// Logging middleware for tRPC procedures
const loggingMiddleware = t.middleware(async (opts: any) => {
  const startTime = Date.now();
  const procedure = `${opts.type}.${opts.path}`;
  
  // Log procedure call
  logger.trpc(procedure, undefined, opts.ctx.user?.id);

  try {
    const result = await opts.next();
    const duration = Date.now() - startTime;
    
    // Log successful result
    logger.trpcResult(procedure, true, duration);
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const err = error as Error;
    
    // Log error result
    logger.trpcResult(procedure, false, duration, err);
    
    throw error;
  }
});

export const router = t.router;
export const publicProcedure = t.procedure.use(loggingMiddleware);
export const middleware = t.middleware;

export const protectedProcedure = t.procedure.use(isAuthenticated).use(loggingMiddleware);
