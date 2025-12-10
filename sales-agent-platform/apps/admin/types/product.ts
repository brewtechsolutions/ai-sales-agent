import type { RouterOutput } from "./trpc";

export type Products = RouterOutput["product"]["getAll"];
export type Product = RouterOutput["product"]["getById"];
