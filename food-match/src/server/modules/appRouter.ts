import { router, publicProcedure } from "../trpc";

export const appRouter = router({
  userList: publicProcedure.query(async ({ ctx }) => {
    // Retrieve users from a datasource, this is an imaginary database
    const users = await ctx.prisma.user.findMany();
    return users;
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
