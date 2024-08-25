import { Box } from '@chakra-ui/react'
import { Navbar } from '~/features/common/components'
import { DonationsPage } from '~/features/donations'

const Home = () => {
  return (
    <Box m={0} w={'100%'}>
      <Navbar />
      <DonationsPage />
    </Box>
  )
}
export default Home
