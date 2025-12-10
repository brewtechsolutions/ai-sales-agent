import { inferAsyncReturnType } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { prisma } from "../prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Inactivity logout period in days (default: 365 days = 1 year)
const INACTIVITY_LOGOUT_DAYS = parseInt(process.env.INACTIVITY_LOGOUT_DAYS || "365", 10);

/**
 * Get the date threshold for inactivity check
 * Returns a date that is INACTIVITY_LOGOUT_DAYS ago from now
 */
function getInactivityThreshold(): Date {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - INACTIVITY_LOGOUT_DAYS);
  return threshold;
}

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return { prisma, req, res, user: null };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };

    // Single Session Enforcement:
    // Check if this specific access token is the one stored in the DB for this user.
    const session = await prisma.userRefreshToken.findFirst({
      where: { userId: decoded.userId },
    });

    if (!session || session.accessToken !== token) {
      // Token mismatch - access token doesn't match stored token
      return { prisma, req, res, user: null };
    }

    // Check if session is revoked
    if (session.revoked) {
      return { prisma, req, res, user: null };
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      return { prisma, req, res, user: null };
    }

    // Check if user has been inactive for the configured period
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { lastLoginAt: true },
    });

    if (user) {
      const inactivityThreshold = getInactivityThreshold();
      
      if (!user.lastLoginAt || user.lastLoginAt < inactivityThreshold) {
        // Revoke session and return null user
        await prisma.userRefreshToken.updateMany({
          where: { userId: decoded.userId },
          data: { revoked: true },
        });
        return { prisma, req, res, user: null };
      }
    }

    return {
      prisma,
      req,
      res,
      user: {
        id: decoded.userId,
        email: decoded.email,
      },
    };
  } catch (error) {
    return { prisma, req, res, user: null };
  }
};

export type Context = inferAsyncReturnType<typeof createContext>;
