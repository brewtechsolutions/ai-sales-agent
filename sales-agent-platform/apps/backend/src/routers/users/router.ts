import { publicProcedure, protectedProcedure, router } from "../../trpc/trpc";
import { userService } from "./services";
import { createUserSchema, updateUserSchema } from "./schemas";

export const userRouter = router({
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      return userService.create(input);
    }),

  getAll: protectedProcedure.query(async () => {
    return userService.getAll();
  }),

  getById: protectedProcedure
    .input((val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query(async ({ input }) => {
      return userService.getById(input);
    }),

  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ input }) => {
      return userService.update(input);
    }),

  delete: protectedProcedure
    .input((val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .mutation(async ({ input }) => {
      return userService.delete(input);
    }),
});
