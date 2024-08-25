import { publicProcedure, router } from '~/server/trpc'

export const tagRouter = router({
  getAllTags: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tag.findMany()
  }),
})
