import { router, publicProcedure } from "../trpc";
import { meRouter } from "./me/me.router";
import { authRouter } from "./auth/auth.router";

export const appRouter = router({
  userList: publicProcedure.query(async ({ ctx }) => {
    // Retrieve users from a datasource, this is an imaginary database
    const users = await ctx.prisma.user.findMany();
    return users;
  }),
  me: meRouter,
  auth: authRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;