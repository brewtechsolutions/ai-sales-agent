import { inferAsyncReturnType } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { prisma } from "../prisma";
import jwt from "jsonwebtoken";
import { getInactivityThreshold } from "../utils/dates";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Inactivity logout period in days (default: 365 days = 1 year)
const INACTIVITY_LOGOUT_DAYS = parseInt(process.env.INACTIVITY_LOGOUT_DAYS || "365", 10);

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

    // Get full user with company information (for multi-tenancy)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        roles: true, // Include roles array for role switching
        companyId: true,
        lastLoginAt: true,
        company: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      return { prisma, req, res, user: null };
    }

    // Check if user has been inactive for the configured period
    const inactivityThreshold = getInactivityThreshold(INACTIVITY_LOGOUT_DAYS);
    
    if (!user.lastLoginAt || user.lastLoginAt < inactivityThreshold) {
      // Revoke session and return null user
      await prisma.userRefreshToken.updateMany({
        where: { userId: decoded.userId },
        data: { revoked: true },
      });
      return { prisma, req, res, user: null };
    }

    // Ensure roles is always an array
    const userRoles = Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : [];

    return {
      prisma,
      req,
      res,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, // Primary role (roles[0])
        roles: userRoles, // All roles array
        companyId: user.companyId,
        company: user.company,
      },
    };
  } catch (error) {
    return { prisma, req, res, user: null };
  }
};

export type Context = inferAsyncReturnType<typeof createContext>;
