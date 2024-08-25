import {
  Box,
  Grid,
  GridItem,
  Image,
  Stack,
  Text,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react'
import { BeneficiarySearch } from './BeneficiarySearch'
import { useRouter } from 'next/router'
import { trpc } from '~/utils/trpc'
import { useState } from 'react'
import { type Option } from 'chakra-multiselect'

export const DonationsPage = () => {
  const [outerQuery, setOuterQuery] = useState('')
  const [tags, setOuterTags] = useState<Option[]>([])
  const [desktop] = useMediaQuery('(min-width: 600px)')
  const router = useRouter()
  const [data] = trpc.donation.searchDonations.useSuspenseQuery({
    searchQuery: outerQuery,
    tags: tags
      .filter((tag) => tag.value && typeof tag.value === 'string')
      .map((tag) => (typeof tag.value === 'string' ? tag.value : '')),
  })
  return (
    <Stack p={20}>
      {/* Search inputs */}
      {/* Results of data pulled from Postgres */}
      <BeneficiarySearch
        setOuterQuery={setOuterQuery}
        setOuterTags={setOuterTags}
        count={data.length}
        outerQuery={outerQuery}
      />
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
                onClick={() => router.push(`/donation/${donation.id}`)}
                cursor={'pointer'}
              >
                <Image
                  src={
                    donation.imageUrls.length > 0
                      ? donation.imageUrls[0]
                      : '/images/placeholder.png'
                  }
                  alt={donation.name}
                  w="100%"
                  h="50%"
                  maxH={'150px'}
                  objectFit="cover"
                  style={{ borderBottom: '1px solid black' }}
                />
                <VStack p={10} align={'start'} justifyContent={'start'}>
                  <Box fontWeight="bold" mb={2}>
                    {donation.name}
                  </Box>
                  <Text>{donation.description}</Text>
                </VStack>
              </Box>
            </GridItem>
          )
        })}
      </Grid>
    </Stack>
  )
}
