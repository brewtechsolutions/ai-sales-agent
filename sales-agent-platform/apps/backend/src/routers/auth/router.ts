import { publicProcedure, router } from "../../trpc/trpc";
import { TRPCError } from "@trpc/server";
import { 
  googleLoginSchema, 
  refreshTokenSchema, 
  phoneLoginSchema, 
  firebaseLoginSchema, 
  firebaseRegisterSchema,
  registerSchema,
  loginSchema,
  setupPasswordSchema,
  selectPortalSchema,
} from "./schemas";
import { 
  getMe, 
  logout, 
  refreshToken, 
  phoneLogin, 
  firebaseLogin, 
  firebaseRegister,
  auth0Register,
  auth0Login,
  auth0GoogleLogin,
  setupPassword,
  selectPortal,
} from "./services";
import { isAuthenticated } from "../../middleware/auth";

export const authRouter = router({
  // ============================================
  // Auth0 Authentication (Primary)
  // ============================================

  /**
   * Email/Password Registration via Auth0
   */
  register: publicProcedure.input(registerSchema).mutation(async ({ input }) => {
    return auth0Register(input);
  }),

  /**
   * Email/Password Login via Auth0
   */
  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
    return auth0Login(input);
  }),

  /**
   * Google OAuth Login via Auth0
   */
  googleLogin: publicProcedure.input(googleLoginSchema).mutation(async ({ input }) => {
    if (!input || !input.accessToken) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "accessToken is required",
      });
    }
    return auth0GoogleLogin(input);
  }),

  /**
   * Setup password for Google user
   * Allows Google users to also login with email/password
   */
  setupPassword: publicProcedure
    .use(isAuthenticated)
    .input(setupPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      return setupPassword(ctx.user!.id, input);
    }),

  // ============================================
  // Token Management
  // ============================================

  /**
   * Refresh access token
   */
  refreshToken: publicProcedure.input(refreshTokenSchema).mutation(async ({ input }) => {
    return refreshToken(input);
  }),

  /**
   * Logout (revoke refresh token)
   */
  logout: publicProcedure.use(isAuthenticated).mutation(async ({ ctx }) => {
    return logout(ctx.user!.id);
  }),

  /**
   * Get current user
   */
  me: publicProcedure.use(isAuthenticated).query(async ({ ctx }) => {
    return getMe(ctx?.user?.id || "");
  }),

  /**
   * Select portal/role for users with multiple roles
   */
  selectPortal: publicProcedure
    .use(isAuthenticated)
    .input(selectPortalSchema)
    .mutation(async ({ ctx, input }) => {
      return selectPortal(ctx.user!.id, input.role);
    }),

  // ============================================
  // Legacy Firebase Authentication (for migration period)
  // ============================================

  phoneLogin: publicProcedure.input(phoneLoginSchema).mutation(async ({ input }) => {
    return phoneLogin(input);
  }),

  firebaseLogin: publicProcedure.input(firebaseLoginSchema).mutation(async ({ input }) => {
    return firebaseLogin(input);
  }),

  firebaseRegister: publicProcedure.input(firebaseRegisterSchema).mutation(async ({ input }) => {
    return firebaseRegister(input);
  }),
});
