import { router, publicProcedure } from '../trpc'
import { meRouter } from './me/me.router'
import { authRouter } from './auth/auth.router'
import { donationRouter } from './donation/donation.router'
import { storageRouter } from './storage/storage.router'
import { tagRouter } from './tags/tag.router'
import { donorRouter } from './donation/donor.router'

export const appRouter = router({
  userList: publicProcedure.query(async ({ ctx }) => {
    // Retrieve users from a datasource, this is an imaginary database
    const users = await ctx.prisma.user.findMany()
    return users
  }),
  me: meRouter,
  auth: authRouter,
  donation: donationRouter,
  storage: storageRouter,
  tag: tagRouter,
  donor: donorRouter,
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
