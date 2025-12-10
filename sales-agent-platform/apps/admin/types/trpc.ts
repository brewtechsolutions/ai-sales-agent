import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/../backend/src/routers";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
