import {
  Box,
  Grid,
  GridItem,
  Image,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import { donationsData } from './mockData'

export const DonationsPage = () => {
  const [desktop] = useMediaQuery('(min-width: 600px)')
  // TODO: Replace mock data with real data

  return (
    <Box p={10}>
      <Grid
        w={'100%'}
        templateColumns={desktop ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)'}
        gap={6}
      >
        {donationsData.map((donation, index) => {
          return (
            <GridItem key={index} w={'100%'} h={'auto'}>
              <Box
                border="1px solid black"
                borderRadius="15px"
                overflow="hidden"
                maxH={'300px'}
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
    </Box>
  )
}
