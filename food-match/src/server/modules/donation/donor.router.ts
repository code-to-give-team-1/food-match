import { protectedProcedure, router } from '~/server/trpc'
import { z } from 'zod'
import { getUserById } from '../me/me.select'

export const donorRouter = router({
  // Donors can create a donation with the relevant details.
  getDonor: protectedProcedure
    .input(
      z.object({
        donorId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await getUserById(ctx.prisma, input.donorId)
      return user
    }),
})
