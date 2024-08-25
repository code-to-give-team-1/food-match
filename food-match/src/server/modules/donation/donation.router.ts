import { protectedProcedure, publicProcedure, router } from '~/server/trpc'
import { addDonationSchema } from '~/schemas/donation/donation'
import { z } from 'zod'
import { env } from '~/env.mjs'

export const donationRouter = router({
  // Donors can create a donation with the relevant details.
  createDonation: protectedProcedure
    .input(addDonationSchema)
    .mutation(async ({ ctx, input }) => {
      const imageKeys = input.imageKeys ?? []
      const imageUrls = imageKeys.map((key) => {
        return `https://${env.R2_PUBLIC_HOSTNAME}/${key}`
      })
      const donation = await ctx.prisma.donation.create({
        data: {
          name: input.name,
          tagsIds: input.tagsIds,
          imageUrls,
          description: input.description,
          expiry: input.expiry,
          quantity: input.quantity,
          passCode: input.passCode,
          donorId: ctx.user.id,
          beneficiaryId: input.beneficiaryId,
        },
      })
      return donation
    }),
  // Retrieve all created donations
  getAllDonations: publicProcedure.query(async ({ ctx }) => {
    const donations = await ctx.prisma.donation.findMany()
    return donations
  }),
  searchDonations: publicProcedure
    .input(
      z.object({
        searchQuery: z.string(),
        tags: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { searchQuery, tags } = input
      if (!searchQuery) {
        if (tags.length) {
          return ctx.prisma.donation.findMany({
            where: {
              tagsIds: {
                hasSome: tags,
              },
            },
          })
        }
        return ctx.prisma.donation.findMany()
      }

      // call python service
      return ctx.prisma.donation.findMany()
    }),
  // Retrieve the details for a specific donation
  getDonation: publicProcedure
    .input(
      z.object({
        donationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const donations = await ctx.prisma.donation.findFirst({
        where: {
          id: input.donationId,
        },
      })
      return donations
    }),
  //   deleteDonation: publicProcedure
  //     .input(z.string())
  //     .mutation(async ({ ctx, input }) => {
  //       const donation = await ctx.prisma.donation.update({
  //         where: { id: input },
  //         data: {
  //           deletedAt: new Date(),
  //         },
  //       })
  //       return donation
  //     }),
})
