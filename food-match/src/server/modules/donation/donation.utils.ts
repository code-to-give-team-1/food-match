import { type PrismaClient, type Donation } from '@prisma/client'

export function generatePasscode() {
  const min = 100000 // This ensures the passcode is at least 6 digits long.
  const max = 999999 // This ensures the passcode does not exceed 6 digits.
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getDonationsWithTags = async ({
  prisma,
  donations,
}: {
  prisma: PrismaClient
  donations: (Donation & { tags: { id: string; name: string }[] })[]
}) => {
  for (const donation of donations) {
    if (donation.tagsIds.length > 0) {
      const tags = await prisma.tag.findMany({
        where: {
          id: {
            in: donation.tagsIds,
          },
        },
      })
      donation.tags = tags // Manually attach the fetched tags to the donations object
    }
  }
  return donations
}
