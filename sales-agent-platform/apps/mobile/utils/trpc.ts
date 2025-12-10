import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../types/trpc";

let token: string | null = null;

export const setToken = (newToken: string | null) => {
  token = newToken;
};

export const trpcContext = createTRPCContext<AppRouter>();

export const useTRPC = () => {
  return trpcContext.useTRPC();
};
