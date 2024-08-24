import { publicProcedure, router } from '~/server/trpc'
import { donationSchema } from '~/schemas/donation/donation'
import { z } from 'zod'
export const donationRouter = router({
  // Donors can create a donation with the relevant details.
  createDonation: publicProcedure
    .input(donationSchema)
    .mutation(async ({ ctx, input }) => {
      const donation = await ctx.prisma.donation.create({
        data: {
          name: input.name,
          tagsIds: input.tagsIds,
          imageUrls: input.imageUrls,
          description: input.description,
          expiry: input.expiry,
          quantity: input.quantity,
          passCode: input.passCode,
          donorId: input.donorId,
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
  // Retrieve the details for a specific donation
  getDonation: publicProcedure
    .input(
      z.object({
        name: z.string(),
        donorId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const donations = await ctx.prisma.donation.findMany({
        where: {
          name: input.name,
          donorId: input.donorId,
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
