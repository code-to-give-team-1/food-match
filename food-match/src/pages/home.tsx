import { Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useLoginState } from '~/features/auth'

const Home = () => {
  const { hasLoginStateFlag } = useLoginState()
  const router = useRouter()
  if (!hasLoginStateFlag) {
    void router.push('/sign-in')
  }
  return <Text>Welcome to Food Match! This is the home page.</Text>
}
export default Home
