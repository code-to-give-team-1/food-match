import { Box } from '@chakra-ui/react'
import { UnauthedNavbar } from '~/features/common/components'
import { DonationsPage } from '~/features/donations'

const Home = () => {
  return (
    <Box m={0} w={'100%'}>
      <UnauthedNavbar />
      <DonationsPage />
    </Box>
  )
}
export default Home
