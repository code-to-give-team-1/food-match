import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useLoginState } from '~/features/auth'
import { Navbar } from '~/features/common/components'
import { useMe } from '~/features/me/api'

const Home = () => {
  const { hasLoginStateFlag } = useLoginState()
  const { me } = useMe()
  const router = useRouter()
  if (!hasLoginStateFlag) {
    void router.push('/sign-in')
  }
  if (!me.isProfileComplete) {
    void router.push('/profile')
  }
  return (
    <Box m={0} w={'100%'}>
      <Navbar />
      Donations go here
    </Box>
  )
}
export default Home
