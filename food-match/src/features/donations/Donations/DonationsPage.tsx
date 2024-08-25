import {
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Skeleton,
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
  const { data, isError, isLoading } = trpc.donation.searchDonations.useQuery({
    searchQuery: outerQuery,
    tags: tags
      .filter((tag) => tag.value && typeof tag.value === 'string')
      .map((tag) => (typeof tag.value === 'string' ? tag.value : '')),
  })

  if (isError) {
    return <div>Failed to load</div>
  }

  if (isLoading) {
    return (
      <Stack p={desktop ? '6rem' : '1.5rem'} pt="6rem">
        {/* Search inputs */}
        {/* Results of data pulled from Postgres */}
        <BeneficiarySearch
          setOuterQuery={setOuterQuery}
          setOuterTags={setOuterTags}
          count={-1}
          outerQuery={outerQuery}
        />
        <Skeleton height="20rem" />
      </Stack>
    )
  }
  return (
    <Stack p={desktop ? '6rem' : '1.5rem'} pt="6rem">
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
        gap="2rem"
      >
        {data.map((donation, index) => {
          if (!donation) return null
          return (
            <GridItem key={index} w={'100%'} h={'auto'}>
              <Box
                border="1px solid black"
                borderRadius="15px"
                overflow="hidden"
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
                <VStack p="1rem" align={'start'} justifyContent={'start'}>
                  <Box fontWeight="bold" mb={2}>
                    {donation.name}
                  </Box>
                  <Text>{donation.description}</Text>
                </VStack>
                <Box w="100%" alignItems="center" justifyContent="center">
                  <Flex w="100%" gap="0.5rem" px="1rem" pb="1rem">
                    {donation.tags.map((tag) => (
                      <Box
                        key={tag.id}
                        bg="#f1f1f1"
                        borderRadius="4px"
                        px="0.5rem"
                        py="0.2rem"
                        mb="0.5rem"
                      >
                        <Text fontSize="0.8rem" color={'gray'}>
                          {tag.name}
                        </Text>
                      </Box>
                    ))}
                  </Flex>
                </Box>
              </Box>
            </GridItem>
          )
        })}
      </Grid>
    </Stack>
  )
}
