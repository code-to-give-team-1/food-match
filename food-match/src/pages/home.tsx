import { Box, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useLoginState } from '~/features/auth'
import { Navbar } from '~/features/common/components'

const Home = () => {
  const { hasLoginStateFlag } = useLoginState()
  const router = useRouter()
  if (!hasLoginStateFlag) {
    void router.push('/sign-in')
  }
  return (
    <Box m={0} w={'100%'}>
      <Navbar />
      Donations go here
    </Box>
  )
}
export default Home
