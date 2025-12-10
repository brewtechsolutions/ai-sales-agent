import type { RouterOutput } from "./trpc";

export type Users = RouterOutput["user"]["getAll"];
export type User = RouterOutput["user"]["getById"];
