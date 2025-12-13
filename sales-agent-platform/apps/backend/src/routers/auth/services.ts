import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { prisma, getPrimaryRole, prepareUserData } from "../../prisma";
import { 
  GoogleLoginInput, 
  RefreshTokenInput, 
  PhoneLoginInput, 
  FirebaseLoginInput, 
  FirebaseRegisterInput,
  RegisterInput,
  LoginInput,
  SetupPasswordInput,
  CreateMyCompanyInput,
  SetPreferredRoleInput,
} from "./schemas";
import { slugify } from "../../utils/strings";
import { generateWebhookSecret } from "../../utils/encryption";
import { CompanyStatus } from "../../constants/company";
import { auth } from "../../config/firebase";
import { 
  auth0Management, 
  isAuth0Configured,
  isManagementApiAvailable,
  getConnectionFromSub,
  AUTH0_CONNECTIONS,
} from "../../config/auth0";

const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
import { randomUUID } from "crypto";
import { getInactivityThreshold, addDays } from "../../utils/dates";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Inactivity logout period in days (default: 365 days = 1 year)
const INACTIVITY_LOGOUT_DAYS = parseInt(process.env.INACTIVITY_LOGOUT_DAYS || "365", 10);

// Refresh token expiry in days (default: 400 days, longer than inactivity period)
// Must be longer than INACTIVITY_LOGOUT_DAYS for inactivity check to work
const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || "400", 10);

const ACCESS_TOKEN_EXPIRES_IN: any = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";

/**
 * Get refresh token expiry date
 * Returns a date that is REFRESH_TOKEN_DAYS from now
 */
function getRefreshTokenExpiry(): Date {
  return addDays(new Date(), REFRESH_TOKEN_DAYS);
}

export const getMe = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        roles: true, // Array of roles
        companyId: true,
        metadata: true, // For preferred role
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Ensure roles is an array (handle legacy single role)
    const roles = Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : [];
    const primaryRole = getPrimaryRole(roles);

    // Get preferred role from metadata
    const metadata = user.metadata as any;
    const preferredRole = metadata?.preferredRole || null;

    return {
      ...user,
      roles, // Always return as array
      role: primaryRole, // Always roles[0]
      preferredRole, // Preferred/default role for login
    };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    });
  }
};

/**
 * Verify Auth0 access token and get user info
 */
async function verifyAuth0Token(accessToken: string) {
  if (!isAuth0Configured()) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Auth0 not configured",
    });
  }

  try {
    const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN!;
    
    // Get user info from Auth0's userinfo endpoint
    const userInfoResponse = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error("Failed to verify Auth0 token");
    }

    const userInfo = await userInfoResponse.json();
    return userInfo;
  } catch (error: any) {
    console.error("Auth0 token verification error:", error);
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: error.message || "Invalid Auth0 token",
    });
  }
}

/**
 * Create or update user in database from Auth0 user info
 * Handles duplicate email scenarios by linking accounts
 */
async function syncUserFromAuth0(auth0User: any) {
  const auth0Id = auth0User.sub;
  const email = auth0User.email;
  const name = auth0User.name || auth0User.nickname || "User";
  const connection = getConnectionFromSub(auth0Id);
  const provider = connection === AUTH0_CONNECTIONS.GOOGLE ? "auth0-google" : "auth0-email";

  if (!email) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Email is required from Auth0",
    });
  }

  // Check if user exists by Auth0 ID
  let user = await prisma.user.findUnique({
    where: { auth0Id },
  });

  if (user) {
    // User exists with this Auth0 ID - update and return
    // Ensure roles array exists (for legacy users)
    const currentRoles = Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : ["company_user"];
    
    user = await prisma.user.update({
      where: { id: user.id },
      data: prepareUserData({
        name,
        email,
        roles: currentRoles, // roles is source of truth - role auto-syncs from roles[0]
        lastLoginAt: new Date(),
      }),
    });
    return user;
  }

  // Check if user exists by email (duplicate email scenario)
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUserByEmail) {
    // Duplicate email found - link the Auth0 account to existing user
    // This handles: user registered with email/password, then tries Google login (or vice versa)
    if (existingUserByEmail.auth0Id && existingUserByEmail.auth0Id !== auth0Id) {
      // User already has a different Auth0 account - need to link accounts in Auth0
      // For now, we'll update the auth0Id (this assumes Auth0 accounts are already linked)
      // In production, you should use Auth0's account linking API
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email already registered with different Auth0 account. Please link accounts.",
      });
    }

    // Link Auth0 account to existing user
    // Ensure roles array exists (for legacy users)
    const currentRoles = Array.isArray(existingUserByEmail.roles) 
      ? existingUserByEmail.roles 
      : existingUserByEmail.role 
        ? [existingUserByEmail.role] 
        : ["company_user"];
    
    user = await prisma.user.update({
      where: { id: existingUserByEmail.id },
      data: prepareUserData({
        auth0Id,
        provider,
        roles: currentRoles, // roles is source of truth - role auto-syncs from roles[0]
        lastLoginAt: new Date(),
      }),
    });
    return user;
  }

  // New user - auto-register in database
  // Default to company_user role (normal user), can be updated later in admin dashboard
  const defaultRoles = ["company_user"];
  user = await prisma.user.create({
    data: prepareUserData({
      email,
      name,
      auth0Id,
      provider,
      roles: defaultRoles, // roles is source of truth - role auto-syncs from roles[0]
      status: "active", // Default status
      lastLoginAt: new Date(),
    }),
  });
  
  console.log(`[Auth0] ✅ New user auto-registered: ${email} with default role: ${defaultRoles[0]}`);
  
  return user;
}

/**
 * Generate JWT tokens for user
 */
function generateTokens(user: { id: string; email: string }) {
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = randomUUID();

  return { token, refreshToken };
}

/**
 * Save refresh token to database
 */
async function saveRefreshToken(userId: string, token: string, accessToken: string) {
  const existingToken = await prisma.userRefreshToken.findFirst({
    where: { userId },
  });

  if (existingToken) {
    await prisma.userRefreshToken.update({
      where: { id: existingToken.id },
      data: {
        token,
        accessToken,
        expiresAt: getRefreshTokenExpiry(),
        revoked: false,
      },
    });
  } else {
    await prisma.userRefreshToken.create({
      data: {
        token,
        accessToken,
        userId,
        expiresAt: getRefreshTokenExpiry(),
      },
    });
  }
}

// ============================================
// Auth0 Authentication Functions
// ============================================

/**
 * Email/Password Registration via Auth0
 * 
 * NOTE: For free tier, this endpoint is optional.
 * Frontend should handle Auth0 signup and send the access token here.
 * This endpoint just verifies the token and syncs user to database.
 * 
 * If Management API is available, we can create users from backend.
 * Otherwise, frontend must handle signup.
 */
export const auth0Register = async (input: RegisterInput) => {
  try {
    if (!isAuth0Configured()) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Auth0 not configured",
      });
    }

    // Check if user already exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email already registered",
      });
    }

    // If Management API is available, create user in Auth0
    // Otherwise, frontend should have already created the user
    if (auth0Management) {
      try {
        const auth0User = await auth0Management.users.create({
          email: input.email,
          password: input.password,
          name: input.name,
          connection: AUTH0_CONNECTIONS.EMAIL,
          email_verified: false,
        }) as any;

        // Sync user to database
        const user = await syncUserFromAuth0({
          sub: auth0User.user_id || auth0User.sub,
          email: auth0User.email,
          name: auth0User.name,
        });

        // Generate tokens
        const { token, refreshToken } = generateTokens(user);
        await saveRefreshToken(user.id, refreshToken, token);

        // Get roles array (handle legacy single role)
        const roles = Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : [];

        return {
          token,
          refreshToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // Primary role
            roles, // Array of all roles
          },
        };
      } catch (error: any) {
        if (error.statusCode === 409) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already registered in Auth0",
          });
        }
        throw error;
      }
    } else {
      // Management API not available - frontend should handle signup
      throw new TRPCError({
        code: "NOT_IMPLEMENTED",
        message: "Backend user creation requires Management API. Please handle signup in frontend using Auth0 SDK and send the access token to verifyAuth0Token endpoint.",
      });
    }
  } catch (error: any) {
    console.error("Auth0 Register Error:", error);
    if (error instanceof TRPCError) throw error;

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message || "Registration failed",
    });
  }
};

/**
 * Email/Password Login via Auth0
 * 
 * NOTE: For free tier, frontend should handle Auth0 login and send access token.
 * This endpoint can optionally use password grant if AUTH0_CLIENT_SECRET is provided.
 * 
 * Recommended approach (free tier):
 * - Frontend uses Auth0 SDK to login
 * - Frontend sends access token to backend
 * - Backend verifies token and syncs user
 */
export const auth0Login = async (input: LoginInput) => {
  try {
    if (!isAuth0Configured()) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Auth0 not configured",
      });
    }

    // If client secret is available, use password grant
    // Otherwise, frontend should handle login
    if (!AUTH0_CLIENT_SECRET) {
      throw new TRPCError({
        code: "NOT_IMPLEMENTED",
        message: "Backend password grant requires AUTH0_CLIENT_SECRET. Please handle login in frontend using Auth0 SDK and send the access token to verifyAuth0Token endpoint.",
      });
    }

    const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN!;
    const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID!;

    // Use Auth0's password grant (Resource Owner Password Grant)
    const response = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "password",
        username: input.email,
        password: input.password,
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        connection: AUTH0_CONNECTIONS.EMAIL,
        scope: "openid profile email",
      }),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as any;
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: errorData.error_description || "Invalid email or password",
      });
    }

    const authResult = (await response.json()) as { access_token: string };
    const { access_token } = authResult;

    // Get user info from Auth0 using the access token
    const userInfoResponse = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Failed to get user info from Auth0",
      });
    }

    const auth0User = await userInfoResponse.json();

    // Sync user to database
    let user = await syncUserFromAuth0(auth0User);

    // Check for preferred role and apply it if user has multiple roles
    const roles = Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : [];
    const metadata = user.metadata as any;
    const preferredRole = metadata?.preferredRole;

    // If user has multiple roles and a preferred role is set, apply it
    if (roles.length > 1 && preferredRole && roles.includes(preferredRole)) {
      // Reorder roles to put preferred role first
      const updatedRoles = [preferredRole, ...roles.filter(r => r !== preferredRole)];
      user = await prisma.user.update({
        where: { id: user.id },
        data: prepareUserData({
          roles: updatedRoles, // Preferred role becomes roles[0], role auto-syncs
        }),
      });
    }

    // Generate tokens
    const { token, refreshToken } = generateTokens(user);
    await saveRefreshToken(user.id, refreshToken, token);

    // Get final roles array
    const finalRoles = Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : [];

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // Primary role (may be preferred role if set)
        roles: finalRoles, // Array of all roles
        preferredRole: preferredRole || null,
      },
    };
  } catch (error: any) {
    console.error("Auth0 Login Error:", error);
    if (error instanceof TRPCError) throw error;

    // Handle Auth0 authentication errors
    if (error.statusCode === 401 || error.message?.includes("Invalid") || error.message?.includes("password")) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message || "Login failed",
    });
  }
};

/**
 * Google OAuth Login via Auth0
 */
export const auth0GoogleLogin = async (input: GoogleLoginInput) => {
  try {
    if (!isAuth0Configured()) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Auth0 not configured",
      });
    }

    // Verify Auth0 access token (from Google OAuth flow)
    const auth0User = await verifyAuth0Token(input.accessToken);

    // Sync user to database (handles duplicate emails)
    let user = await syncUserFromAuth0(auth0User);

    // Check for preferred role and apply it if user has multiple roles
    const roles = Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : [];
    const metadata = user.metadata as any;
    const preferredRole = metadata?.preferredRole;

    // If user has multiple roles and a preferred role is set, apply it
    if (roles.length > 1 && preferredRole && roles.includes(preferredRole)) {
      // Reorder roles to put preferred role first
      const updatedRoles = [preferredRole, ...roles.filter(r => r !== preferredRole)];
      user = await prisma.user.update({
        where: { id: user.id },
        data: prepareUserData({
          roles: updatedRoles, // Preferred role becomes roles[0], role auto-syncs
        }),
      });
    }

    // Generate tokens
    const { token, refreshToken } = generateTokens(user);
    await saveRefreshToken(user.id, refreshToken, token);

    // Get final roles array
    const finalRoles = Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : [];

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // Primary role (may be preferred role if set)
        roles: finalRoles, // Array of all roles
        preferredRole: preferredRole || null,
      },
    };
  } catch (error: any) {
    console.error("Auth0 Google Login Error:", error);
    if (error instanceof TRPCError) throw error;

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message || "Google login failed",
    });
  }
};

/**
 * Setup password for Google user (allows Google users to also login with password)
 * 
 * NOTE: Requires Management API (M2M application) to update Auth0 user.
 * For free tier without M2M, this operation should be done in Auth0 Dashboard or via frontend.
 */
export const setupPassword = async (userId: string, input: SetupPasswordInput) => {
  try {
    if (!isAuth0Configured()) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Auth0 not configured",
      });
    }

    if (!isManagementApiAvailable()) {
      throw new TRPCError({
        code: "NOT_IMPLEMENTED",
        message: "Password setup requires Management API. Please configure AUTH0_M2M_CLIENT_ID and AUTH0_M2M_CLIENT_SECRET, or handle password setup in Auth0 Dashboard.",
      });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.auth0Id) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found or not using Auth0",
      });
    }

    // Check if user is a Google user
    if (user.provider !== "auth0-google") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User is not a Google user",
      });
    }

    // Link email/password connection to existing Auth0 user
    await auth0Management!.users.update(
      { id: user.auth0Id },
      {
        password: input.password,
        connection: AUTH0_CONNECTIONS.EMAIL,
      }
    );

    // Update provider to indicate user can use both methods
    await prisma.user.update({
      where: { id: user.id },
      data: {
        provider: "auth0-google-email", // Indicates both methods available
      },
    });

    return {
      success: true,
      message: "Password set up successfully. You can now login with email and password.",
    };
  } catch (error: any) {
    console.error("Setup Password Error:", error);
    if (error instanceof TRPCError) throw error;

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message || "Failed to set up password",
    });
  }
};

/**
 * Select portal/role for user with multiple roles
 * @param setAsDefault - Whether to set this role as the default for future logins
 */
export const selectPortal = async (userId: string, role: string, setAsDefault: boolean = false) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        roles: true,
        metadata: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Get roles array
    const roles = Array.isArray(user.roles) ? user.roles : [];

    // Check if user has the requested role
    if (!roles.includes(role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User does not have access to this portal",
      });
    }

    // Update primary role by moving it to first position in roles array
    const updatedRoles = [role, ...roles.filter(r => r !== role)];
    
    // Update metadata with preferred role if requested
    const metadata = (user.metadata as any) || {};
    if (setAsDefault) {
      metadata.preferredRole = role;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: prepareUserData({
        roles: updatedRoles, // Move selected role to first position - role auto-syncs from roles[0]
        metadata: metadata,
      }),
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        roles: true,
        companyId: true,
        metadata: true,
      },
    });

    // Ensure roles is always an array
    const userRoles = Array.isArray(updatedUser.roles) ? updatedUser.roles : updatedUser.role ? [updatedUser.role] : [];
    const updatedMetadata = updatedUser.metadata as any;
    const preferredRole = updatedMetadata?.preferredRole || null;

    return {
      success: true,
      role: updatedUser.role,
      roles: userRoles,
      preferredRole,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        roles: userRoles,
        company_id: updatedUser.companyId,
        preferredRole,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to select portal",
    });
  }
};

/**
 * Set preferred/default role for user (for future logins)
 */
export const setPreferredRole = async (userId: string, input: SetPreferredRoleInput) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        roles: true,
        metadata: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Get roles array
    const roles = Array.isArray(user.roles) ? user.roles : [];

    // Check if user has the requested role
    if (!roles.includes(input.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User does not have access to this role",
      });
    }

    // Update metadata with preferred role
    const metadata = (user.metadata as any) || {};
    if (input.setAsDefault) {
      metadata.preferredRole = input.role;
    } else {
      delete metadata.preferredRole;
    }

    // If setting as default, also update the current role
    let updatedRoles = roles;
    if (input.setAsDefault) {
      updatedRoles = [input.role, ...roles.filter(r => r !== input.role)];
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: prepareUserData({
        roles: updatedRoles,
        metadata: metadata,
      }),
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        roles: true,
        companyId: true,
        metadata: true,
      },
    });

    const userRoles = Array.isArray(updatedUser.roles) ? updatedUser.roles : updatedUser.role ? [updatedUser.role] : [];
    const updatedMetadata = updatedUser.metadata as any;
    const preferredRole = updatedMetadata?.preferredRole || null;

    return {
      success: true,
      preferredRole,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        roles: userRoles,
        company_id: updatedUser.companyId,
        preferredRole,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to set preferred role",
    });
  }
};

export const logout = async (userId: string) => {
  try {
    // Revoke the user's refresh token session (single login enforcement)
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
    const inactivityThreshold = getInactivityThreshold(INACTIVITY_LOGOUT_DAYS);
    
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

/**
 * Create company for authenticated user (onboarding)
 * Only company_admin role can create companies (and can create multiple)
 */
export const createMyCompany = async (userId: string, input: CreateMyCompanyInput) => {
  try {
    // Check if user exists and has company_admin role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, companyId: true, role: true, roles: true },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Only company_admin can create companies
    const userRoles = Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : [];
    if (!userRoles.includes("company_admin") && user.role !== "company_admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only company administrators can create companies",
      });
    }

    // Auto-generate slug
    const slug = slugify(input.name);

    // Check if slug already exists
    const existing = await prisma.company.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Company with name "${input.name}" already exists. Please choose a different name.`,
      });
    }

    // Generate webhook secret
    const webhookSecret = generateWebhookSecret();

    // Create company
    const company = await prisma.company.create({
      data: {
        name: input.name,
        slug,
        logoUrl: input.logoUrl,
        industryCategory: input.industryCategory,
        country: input.country,
        preferredLanguage: input.preferredLanguage,
        currency: input.currency,
        timezone: input.timezone,
        dateFormat: input.dateFormat,
        status: CompanyStatus.TRIAL,
        webhookSecret,
        settings: {},
      },
    });

    // Create default company settings
    await prisma.companySettings.create({
      data: {
        companyId: company.id,
        autoAssignEnabled: false,
        assignmentStrategy: "manual",
      },
    });

    // Note: We don't assign the user to the company automatically
    // Company admins can manage multiple companies without being assigned to them
    // They can switch between companies or assign themselves if needed

    return {
      company,
      message: "Company created successfully. You can manage multiple companies as a company administrator.",
    };
  } catch (error: any) {
    console.error("Create My Company Error:", error);
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message || "Failed to create company",
    });
  }
};
