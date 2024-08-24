import { publicProcedure, router } from '~/server/trpc'
import { emailSessionRouter } from './email/email.router'

export const authRouter = router({
  email: emailSessionRouter,
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.session?.destroy()
    return { isLoggedIn: false }
  }),
  login: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.session!.save()
    return { isLoggedIn: true }
  }),
})
