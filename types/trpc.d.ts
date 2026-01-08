import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc";

export type RouterOutputs = inferRouterOutputs<AppRouter>;
