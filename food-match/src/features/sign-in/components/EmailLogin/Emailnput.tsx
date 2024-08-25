import {
  FormControl,
  Stack,
  Button,
  Input,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useZodForm } from '~/lib/form'
import { trpc } from '~/utils/trpc'
import { emailSignInSchema } from '~/schemas/auth/email/sign-in'
import { type VfnStepData } from '../SignInContext'

interface EmailInputProps {
  onSuccess: (props: VfnStepData) => void
}

export const EmailInput: React.FC<EmailInputProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useZodForm({
    schema: emailSignInSchema,
  })

  const router = useRouter()

  const loginMutation = trpc.auth.email.login.useMutation({
    onSuccess,
    onError: (error) => setError('email', { message: error.message }),
  })

  useEffect(() => {
    if (router.query.error) {
      setError('email', { message: String(router.query.error) })
    }
  }, [router.query.error, setError])

  const handleSignIn = handleSubmit(({ email }) => {
    return loginMutation.mutate({ email })
  })

  return (
    <form onSubmit={handleSignIn} noValidate>
      <Stack spacing="1rem" width="full">
        <FormControl
          id="email"
          isRequired
          isInvalid={!!errors.email}
          isReadOnly={loginMutation.isLoading}
        >
          <FormLabel marginBottom={'5px'}>
            Log in with your email address to get a one-time password (OTP)
          </FormLabel>
          <Input
            borderRadius={'10px'}
            width="100%"
            placeholder="e.g. johndoe@gmail.com"
            autoFocus
            {...register('email')}
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <Button
          size="xs"
          height="2.75rem"
          type="submit"
          bgColor={'black'}
          color="white"
          borderRadius={'15px'}
          isLoading={loginMutation.isLoading}
        >
          Get OTP
        </Button>
      </Stack>
    </form>
  )
}
