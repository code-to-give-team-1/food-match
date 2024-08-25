import { protectedProcedure, publicProcedure, router } from '~/server/trpc'
import { addDonationSchema } from '~/schemas/donation/donation'
import { z } from 'zod'
import { env } from '~/env.mjs'
import { sendMail } from '~/lib/mail'

function generatePasscode() {
  const min = 100000 // This ensures the passcode is at least 6 digits long.
  const max = 999999 // This ensures the passcode does not exceed 6 digits.
  return Math.floor(Math.random() * (max - min + 1)) + min
}

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

      const result = await fetch('http://localhost:5001/vectorize_donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId: donation.id,
        }),
      })

      if (!result.ok) {
        // no need to fail the request if the vectorization fails
        // use logger in the future
        console.error('Failed to vectorize donation')
      }

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
      const results = await fetch('http://localhost:5001/search_donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          tags,
        }),
      })
      if (!results.ok) {
        console.error('Failed to search donations from python service')
        return ctx.prisma.donation.findMany()
      }
      const data = await results.json()
      console.log(data)
      const donationIds = data.top_donations.map(
        (donation: [string, number]) => donation[0],
      ) as string[]
      const donations = await ctx.prisma.donation.findMany({
        where: {
          id: {
            in: donationIds,
          },
          tagsIds: tags.length
            ? {
                hasSome: tags,
              }
            : undefined,
        },
      })
      // sort according to order in donationIds
      const sortedResults = donationIds.map((id) =>
        donations.find((result) => result.id === id),
      )
      return sortedResults
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
        include: {
          donor: true,
          beneficiary: true,
        },
      })
      return donations
    }),
  claimDonation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const passCode = generatePasscode()
      const donation = await ctx.prisma.donation.update({
        where: { id: input.id },
        data: {
          beneficiaryId: ctx.user.id,
          passCode: passCode.toString(),
        },
        include: {
          donor: true,
          beneficiary: true,
        },
      })
      await sendMail({
        subject: `Your donation ${donation.name} has been claimed`,
        body: `The passcode to collect it is <b>${passCode}</b>.
    The recepient is ${ctx.user.name ?? ctx.user.email}.
`,
        recipient: donation.donor.email!,
      })

      await sendMail({
        subject: `You have claimed ${donation.name}`,
        body: `The passcode to collect it is <b>${passCode}</b>.
    The donor is ${donation.donor.name ?? donation.donor.email}.
`,
        recipient: ctx.user.email!,
      })

      return passCode
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
