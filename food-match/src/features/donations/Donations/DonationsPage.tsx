import {
  Box,
  Grid,
  GridItem,
  Image,
  Stack,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import { BeneficiarySearch } from './BeneficiarySearch'
import { useRouter } from 'next/router'
import { trpc } from '~/utils/trpc'

export const DonationsPage = () => {
  const [desktop] = useMediaQuery('(min-width: 600px)')
  const router = useRouter()
  const [data] = trpc.donation.getAllDonations.useSuspenseQuery()
  return (
    <Stack p={20} gap={10}>
      {/* Search inputs */}
      {/* Results of data pulled from Postgres */}
      <BeneficiarySearch />
      <Grid
        w={'100%'}
        templateColumns={desktop ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)'}
        gap={20}
      >
        {data.map((donation, index) => {
          return (
            <GridItem key={index} w={'100%'} h={'auto'}>
              <Box
                border="1px solid black"
                borderRadius="15px"
                overflow="hidden"
                maxH={'300px'}
                onClick={() => router.push(`/donation/${donation.name}`)}
                cursor={'pointer'}
              >
                <Image
                  src={donation.imageUrls[0]}
                  alt={donation.name}
                  w="100%"
                  h="50%"
                  maxH={'150px'}
                  objectFit="cover"
                />
                <Box p={4}>
                  <Text fontWeight="bold" mb={2}>
                    {donation.name}
                  </Text>
                  <Text>{donation.description}</Text>
                </Box>
              </Box>
            </GridItem>
          )
        })}
      </Grid>
    </Stack>
  )
}
