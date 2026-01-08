import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

type Context = {
  db: typeof db;
  user: Awaited<ReturnType<typeof auth>>;
};

const t = initTRPC.context<Context>().create();

const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  const user = await auth();

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
      db,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
