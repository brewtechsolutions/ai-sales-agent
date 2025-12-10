import { router } from "../trpc/trpc";
import { userRouter } from "./users/router";
import { authRouter } from "./auth/router";
import { productRouter } from "./products/router";

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  product: productRouter,
});

export type AppRouter = typeof appRouter;
