import { Stack, Flex } from '@chakra-ui/react'
import {
  EmailLoginForm,
  SignInContextProvider,
} from '~/features/sign-in/components'
import { useMediaQuery } from '@chakra-ui/react'
import Image from 'next/image'

export const SignIn = (): JSX.Element => {
  const [desktop] = useMediaQuery('(min-width: 600px)')

  return (
    // Context Wrapper for Login
    <SignInContextProvider>
      {/* Login UI */}
      <Flex
        flexDir={desktop ? 'row' : 'column'}
        bg="#f1f1f1"
        w="100%"
        h="100vh"
        justifyContent={'center'}
      >
        {/* Logo */}
        <Stack w={desktop ? '50%' : '100%'} align={'center'} justify={'center'}>
          <Image
            src="/images/food-match-logo.png"
            alt="Logo for matching donations"
            width="260"
            height="100"
          />
        </Stack>
        {/* Login Credentials */}
        <Stack
          w={desktop ? '50%' : '100%'}
          px="1rem"
          align={'center'}
          justify={'center'}
          bg={desktop ? 'white' : ''}
        >
          <EmailLoginForm />
        </Stack>
      </Flex>
    </SignInContextProvider>
  )
}

export default SignIn
