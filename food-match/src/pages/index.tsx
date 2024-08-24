import { useRouter } from 'next/router'
import { Skeleton } from '@chakra-ui/react'

// Used for redirecting according to a user's role
export const IndexPage = () => {
  const router = useRouter()
  void router.push('/home')

  return <Skeleton h="$100vh" w="$100vw" />
}

export default IndexPage
