/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { z } from 'zod'
import { protectedProcedure, router } from '~/server/trpc'
import { updateMeSchema } from '~/schemas/me'
import { TRPCError } from '@trpc/server'
import { Prisma } from '@prisma/client'
import { defaultMeSelect, getUserById } from './me.select'
import { getIsProfileComplete } from './me.util'

export const meRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await getUserById(ctx.prisma, ctx.user.id)
    const isProfileComplete = getIsProfileComplete(user)
    return {
      ...user,
      isProfileComplete,
    }
  }),
  updateAvatar: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          image: input.imageUrl,
        },
        select: defaultMeSelect,
      })
    }),
  update: protectedProcedure
    .input(updateMeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            name: input.name,
            dob: input.dob,
            mobile: input.mobile,
            email: input.email,
          },
        })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            ctx.logger.info('Username conflict', {
              userId: ctx.user.id,
              current: ctx.user.name,
            })

            throw new TRPCError({
              message: 'That username has been taken. Please choose another.',
              code: 'CONFLICT',
              cause: e,
            })
          }
        }
        throw e
      }
    }),
})
