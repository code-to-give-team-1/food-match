import { protectedProcedure, router } from '~/server/trpc'

export const tagRouter = router({
  getAllTags: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tag.findMany()
  }),
})
