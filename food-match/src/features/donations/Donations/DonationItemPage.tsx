import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { trpc } from '~/utils/trpc'

export type DonationItemType =
  | {
      id: string
      name: string
      tagsIds: string[]
      imageUrls: string[]
      description: string
      expiry: Date
      quantity: string
      passCode: string | null
      donorId: string
      beneficiaryId: string | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }
  | null
  | undefined

export const DonationItemPage = ({ item }: { item: DonationItemType }) => {
  if (item) {
    const { data: donorData } = trpc.donor.getDonor.useQuery({
      donorId: item.donorId,
    })
    return (
      <HStack p={20} w={'100%'} align={'start'} gap={20}>
        <Box border={'1px solid black'} borderRadius={'15px'} w={'30%'}>
          <Image
            src={`${
              item.imageUrls.length > 0
                ? item.imageUrls[0]
                : '/images/placeholder.png'
            }`}
            width={400}
            height={500}
            alt="Item Image"
            style={{ borderRadius: '15px' }}
          />
        </Box>
        <Stack>
          <Text as="b">{item.name}</Text>
          <Text>Description: {item.description}</Text>
          <Text>Quantity: {item.quantity}</Text>

          <Text>Donor: {donorData?.name}</Text>
          <Text>Expiry: {item.expiry.toISOString()}</Text>
          <Text>Created At: {item.createdAt.toISOString()}</Text>
          {!item.beneficiaryId ? (
            <Button
              bgColor={'black'}
              color={'white'}
              h={'25px'}
              borderRadius={'15px'}
            >
              I want to collect this item
            </Button>
          ) : (
            <Text>
              This item is being collected by user {item.beneficiaryId}.
            </Text>
          )}
        </Stack>
      </HStack>
    )
  } else {
    return <Text>Item not found</Text>
  }
}
