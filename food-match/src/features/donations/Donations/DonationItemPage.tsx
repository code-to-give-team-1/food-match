import { AtSignIcon, CalendarIcon, InfoIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  HStack,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react'
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
  const [desktop] = useMediaQuery('(min-width: 600px)')
  // const desktop = false
  const formatISOString = (date: Date): string => {
    return (
      date.getUTCDate() + '/' + date.getUTCMonth() + '/' + date.getUTCFullYear()
    )
  }

  if (item) {
    const { data: donorData } = trpc.donor.getDonor.useQuery({
      donorId: item.donorId,
    })
    return (
      <Stack
        padding={'2rem'}
        marginBlock={'10vh'}
        boxSizing="border-box"
        h={'70vh'}
        w={'100%'}
        align={'start'}
        gap={'2rem'}
        direction={desktop ? 'row' : 'column'}
      >
        <Image
          src={`${
            item.imageUrls.length > 0
              ? item.imageUrls[0]
              : '/images/placeholder.png'
          }`}
          alt="Item Image"
          border={'1px solid black'}
          borderRadius={'15px'}
          w={desktop ? '40%' : '100%'}
          h={'100%'}
          objectFit={'cover'}
        />
        <Stack h={'100%'}>
          <Box>
            <Text as="b">{item.name}</Text>
            <Text color={'gray'}>
              <CalendarIcon /> Expiry Date: {formatISOString(item.expiry)}
            </Text>
            <Text color={'gray'}>
              <InfoIcon /> Quantity: {item.quantity}
            </Text>

            <Text color={'gray'}>
              <AtSignIcon /> Donor: {donorData?.name}
            </Text>
          </Box>

          <Box>
            <Text>The donor says: {item.description}</Text>
          </Box>
          <Box>
            {' '}
            <Text color={'gray'}>
              Created At: {formatISOString(item.createdAt)}
            </Text>
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
          </Box>
        </Stack>
      </Stack>
    )
  } else {
    return <Text>Item not found</Text>
  }
}
