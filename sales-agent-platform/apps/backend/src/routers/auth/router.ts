import { publicProcedure, router } from "../../trpc/trpc";
import { googleLoginSchema, refreshTokenSchema, phoneLoginSchema, firebaseLoginSchema, firebaseRegisterSchema } from "./schemas";
import { getMe, logout, googleLogin, refreshToken, phoneLogin, firebaseLogin, firebaseRegister } from "./services";
import { isAuthenticated } from "../../middleware/auth";

export const authRouter = router({

  googleLogin: publicProcedure.input(googleLoginSchema).mutation(async ({ input }) => {
    return googleLogin(input);
  }),

  refreshToken: publicProcedure.input(refreshTokenSchema).mutation(async ({ input }) => {
    return refreshToken(input);
  }),

  phoneLogin: publicProcedure.input(phoneLoginSchema).mutation(async ({ input }) => {
    return phoneLogin(input);
  }),

  firebaseLogin: publicProcedure.input(firebaseLoginSchema).mutation(async ({ input }) => {
    return firebaseLogin(input);
  }),

  firebaseRegister: publicProcedure.input(firebaseRegisterSchema).mutation(async ({ input }) => {
    return firebaseRegister(input);
  }),

  logout: publicProcedure.use(isAuthenticated).mutation(async ({ ctx }) => {
    return logout(ctx.user!.id);
  }),

  me: publicProcedure.use(isAuthenticated).query(async ({ ctx }) => {
    return getMe(ctx?.user?.id || "");
  }),
});
