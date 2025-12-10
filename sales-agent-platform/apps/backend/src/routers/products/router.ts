import { publicProcedure, protectedProcedure, router } from "../../trpc/trpc";
import { productService } from "./services";
import { createProductSchema, updateProductSchema } from "./schemas";
import { z } from "zod";

export const productRouter = router({
  create: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      return productService.create(input);
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      })
    )
    .query(async ({ input }) => {
      return productService.getAll(input);
    }),

  getById: protectedProcedure
    .input((val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query(async ({ input }) => {
      return productService.getById(input);
    }),

  update: protectedProcedure
    .input(updateProductSchema)
    .mutation(async ({ input }) => {
      return productService.update(input);
    }),

  delete: protectedProcedure
    .input((val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .mutation(async ({ input }) => {
      return productService.delete(input);
    }),

  getStats: protectedProcedure.query(async () => {
    return productService.getStats();
  }),
});
