import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma";
import { GoogleLoginInput, RefreshTokenInput, PhoneLoginInput, FirebaseLoginInput, FirebaseRegisterInput } from "./schemas";
import { auth } from "../../config/firebase";
import { randomUUID } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Inactivity logout period in days (default: 365 days = 1 year)
const INACTIVITY_LOGOUT_DAYS = parseInt(process.env.INACTIVITY_LOGOUT_DAYS || "365", 10);

// Refresh token expiry in days (default: 400 days, longer than inactivity period)
// Must be longer than INACTIVITY_LOGOUT_DAYS for inactivity check to work
const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || "400", 10);

const ACCESS_TOKEN_EXPIRES_IN: any = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
/**
 * Get the date threshold for inactivity check
 * Returns a date that is INACTIVITY_LOGOUT_DAYS ago from now
 */
function getInactivityThreshold(): Date {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - INACTIVITY_LOGOUT_DAYS);
  return threshold;
}

/**
 * Get refresh token expiry date
 * Returns a date that is REFRESH_TOKEN_DAYS from now
 */
function getRefreshTokenExpiry(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
}

export const getMe = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }
};

export const logout = async (userId: string) => {
  try {
    // Revoke the user's refresh token session
    const session = await prisma.userRefreshToken.findFirst({
      where: { userId },
    });

    if (session) {
      await prisma.userRefreshToken.update({
        where: { id: session.id },
        data: {
          revoked: true,
        },
      });
    }

    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong during logout",
    });
  }
};

export const googleLogin = async (input: GoogleLoginInput) => {
  try {
    if (!auth) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Firebase Admin not initialized",
      });
    }

    const decodedToken = await auth.verifyIdToken(input.idToken);
    const { uid, email, name } = decodedToken;

    if (!email) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email is required from Google Login",
      });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || "User",
          firebaseUid: uid,
          provider: "google",
          lastLoginAt: new Date(),
        },
      });
    } else {
      // Update firebaseUid and lastLoginAt
      const updateData: { firebaseUid?: string; provider?: string; lastLoginAt: Date } = {
        lastLoginAt: new Date(),
      };
      
      if (!user.firebaseUid) {
        updateData.firebaseUid = uid;
        updateData.provider = "google";
      }
      
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN, // Short-lived access token
    });

    const refreshToken = randomUUID();
    
    // Single Session: Update existing token or create new one
    const existingToken = await prisma.userRefreshToken.findFirst({
      where: { userId: user.id },
    });

    if (existingToken) {
      await prisma.userRefreshToken.update({
        where: { id: existingToken.id },
        data: {
          token: refreshToken,
          accessToken: token,
          expiresAt: getRefreshTokenExpiry(),
          revoked: false,
        },
      });
    } else {
      await prisma.userRefreshToken.create({
        data: {
          token: refreshToken,
          accessToken: token,
          userId: user.id,
          expiresAt: getRefreshTokenExpiry(),
        },
      });
    }

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Google Login Error:", error);
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Google Login failed",
    });
  }
};

export const refreshToken = async (input: RefreshTokenInput) => {
  try {
    const storedToken = await prisma.userRefreshToken.findUnique({
      where: { token: input.refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid refresh token",
      });
    }

    if (storedToken.revoked) {
      // Reuse detection: revoke all tokens for this user family?
      // For now just error
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Token revoked",
      });
    }

    if (new Date() > storedToken.expiresAt) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Token expired",
      });
    }

    // Check if user has been inactive for the configured period
    const inactivityThreshold = getInactivityThreshold();
    
    if (!storedToken.user.lastLoginAt || storedToken.user.lastLoginAt < inactivityThreshold) {
      // Revoke token and force re-login
      await prisma.userRefreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });
      
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Account inactive for over ${INACTIVITY_LOGOUT_DAYS} days. Please login again.`,
      });
    }

    // Rotate token: Update existing record with new token
    const newRefreshToken = randomUUID();
    
    const token = jwt.sign(
      { userId: storedToken.user.id, email: storedToken.user.email },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    await prisma.userRefreshToken.update({
      where: { id: storedToken.id },
      data: {
        token: newRefreshToken,
        accessToken: token,
        expiresAt: getRefreshTokenExpiry(),
        revoked: false,
      },
    });
    
    // Update lastLoginAt on successful refresh (user is active)
    await prisma.user.update({
      where: { id: storedToken.user.id },
      data: { lastLoginAt: new Date() },
    });
    
    return {
      token,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Refresh token failed",
    });
  }
};

export const phoneLogin = async (input: PhoneLoginInput) => {
  try {
    if (!auth) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Firebase Admin not initialized",
      });
    }

    const decodedToken = await auth.verifyIdToken(input.idToken);
    const { uid, phone_number } = decodedToken;

    if (!phone_number) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Phone number is required from Phone Login",
      });
    }

    let user = await prisma.user.findUnique({
      where: { phoneNumber: phone_number },
    });

    if (!user) {
      // Check if user exists by firebaseUid (unlikely for new phone users but possible if linked)
      // If name is NOT provided, we cannot create a user.
      if (!input.name) {
         throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found, registration required",
        });
      }

      // For now, assume new user if phone number not found
      user = await prisma.user.create({
        data: {
          phoneNumber: phone_number,
          name: input.name,
          firebaseUid: uid,
          provider: "phone",
          lastLoginAt: new Date(),
        },
      });
    } else {
      // Update firebaseUid and lastLoginAt
      const updateData: { firebaseUid?: string; provider?: string; lastLoginAt: Date } = {
        lastLoginAt: new Date(),
      };
      
      if (!user.firebaseUid) {
        updateData.firebaseUid = uid;
        updateData.provider = "phone";
      }
      
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email || "" }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = randomUUID();
    
    // Single Session: Update existing token or create new one
    const existingToken = await prisma.userRefreshToken.findFirst({
      where: { userId: user.id },
    });

    if (existingToken) {
      await prisma.userRefreshToken.update({
        where: { id: existingToken.id },
        data: {
          token: refreshToken,
          accessToken: token,
          expiresAt: getRefreshTokenExpiry(),
          revoked: false,
        },
      });
    } else {
      await prisma.userRefreshToken.create({
        data: {
          token: refreshToken,
          accessToken: token,
          userId: user.id,
          expiresAt: getRefreshTokenExpiry(),
        },
      });
    }

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    };
  } catch (error) {
    console.error("Phone Login Error:", error);
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Phone Login failed",
    });
  }
};

export const firebaseLogin = async (input: FirebaseLoginInput) => {
  try {
    if (!auth) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Firebase Admin not initialized",
      });
    }

    const decodedToken = await auth.verifyIdToken(input.idToken);
    const { uid, email } = decodedToken;

    if (!email) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email is required from Firebase Login",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { firebaseUid: uid }
        ]
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Update firebaseUid and lastLoginAt
    const updateData: { firebaseUid?: string; lastLoginAt: Date } = {
      lastLoginAt: new Date(),
    };
    
    if (user.firebaseUid !== uid) {
      updateData.firebaseUid = uid;
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = randomUUID();
    
    // Single Session: Update existing token or create new one
    const existingToken = await prisma.userRefreshToken.findFirst({
      where: { userId: user.id },
    });

    if (existingToken) {
      await prisma.userRefreshToken.update({
        where: { id: existingToken.id },
        data: {
          token: refreshToken,
          accessToken: token,
          expiresAt: getRefreshTokenExpiry(),
          revoked: false,
        },
      });
    } else {
      await prisma.userRefreshToken.create({
        data: {
          token: refreshToken,
          accessToken: token,
          userId: user.id,
          expiresAt: getRefreshTokenExpiry(),
        },
      });
    }

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Firebase Login Error:", error);
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Firebase Login failed",
    });
  }
};

export const firebaseRegister = async (input: FirebaseRegisterInput) => {
  try {
    if (!auth) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Firebase Admin not initialized",
      });
    }

    const decodedToken = await auth.verifyIdToken(input.idToken);
    const { uid, email } = decodedToken;

    if (!email) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email is required from Firebase Register",
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { firebaseUid: uid }
        ]
      },
    });

    if (existingUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User already exists",
      });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: input.name,
        firebaseUid: uid,
        provider: "email",
        lastLoginAt: new Date(),
      },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = randomUUID();
    
    await prisma.userRefreshToken.create({
      data: {
        token: refreshToken,
        accessToken: token,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Firebase Register Error:", error);
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Firebase Register failed",
    });
  }
};
