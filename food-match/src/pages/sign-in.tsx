import { Icon, Button, Stack, Flex } from '@chakra-ui/react'
import { BiLeftArrowAlt } from 'react-icons/bi'
import {
  EmailLoginForm,
  SignInContextProvider,
} from '~/features/sign-in/components'
import { useMediaQuery } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Image from 'next/image'

export const SignIn = (): JSX.Element => {
  const [desktop] = useMediaQuery('(min-width: 600px)')

  const router = useRouter()
  return (
    // Context Wrapper for Login
    <SignInContextProvider>
      {/* Login UI */}
      <Flex
        flexDir={desktop ? 'row' : 'column'}
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
        <Stack w={desktop ? '50%' : '100%'} align={'center'} justify={'center'}>
          <Button
            leftIcon={<Icon as={BiLeftArrowAlt} fontSize="1rem" />}
            variant="link"
            size="xs"
            onClick={() => router.back()}
            bgColor={'black'}
            color={'white'}
            borderRadius={'15px'}
            border={'none'}
            h={'20px'}
          >
            Back
          </Button>
          <EmailLoginForm />
        </Stack>
      </Flex>
    </SignInContextProvider>
  )
}

export default SignIn
