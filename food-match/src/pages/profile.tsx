import { useMe } from '~/features/me/api'
// import { getIsProfileComplete } from '~/server/modules/me/me.util'
import {
  FormControl,
  FormLabel,
  Stack,
  Input,
  FormErrorMessage,
  Button,
  useMediaQuery,
} from '@chakra-ui/react'
import { useZodForm } from '~/lib/form'
import { updateMeSchema } from '~/schemas/me'
import { trpc } from '~/utils/trpc'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { Navbar } from '~/features/common/components'
import { useRouter } from 'next/router'
import { useLoginState } from '~/features/auth'

export const Profile = () => {
  const { me } = useMe()
  const [desktop] = useMediaQuery('(min-width: 600px)')
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useZodForm({
    schema: updateMeSchema,
    defaultValues: {
      name: me.name,
      dob: me.dob,
      mobile: me.mobile,
      email: me.email,
    },
  })

  const watchDob = watch('dob')

  const updateMeMutation = trpc.me.update.useMutation({
    onSuccess: () => {
      void router.push('/home')
    },
    onError: (error) => {
      setError('name', { message: error.message })
    },
  })
  const { hasLoginStateFlag } = useLoginState()
  if (!hasLoginStateFlag) {
    void router.push('/sign-in')
  }

  const handleUpdate = handleSubmit((input) => {
    console.log(input)
    return updateMeMutation.mutate(input)
  }, console.error)
  return (
    <>
      <Navbar />
      <Stack
        spacing="1rem"
        alignItems="center"
        justifyContent="center"
        pt="6rem"
      >
        <FormControl
          id="name"
          isRequired
          isInvalid={!!errors.name}
          isReadOnly={updateMeMutation.isLoading}
          w={desktop ? '50%' : '80%'}
        >
          <FormLabel>Name</FormLabel>
          <Input
            {...register('name')}
            placeholder="Name"
            borderRadius={'15px'}
            w="100%"
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="dob"
          isRequired
          isInvalid={!!errors.dob}
          isReadOnly={updateMeMutation.isLoading}
          w={desktop ? '50%' : '80%'}
        >
          <FormLabel>Date of Birth</FormLabel>
          <SingleDatepicker
            name="dob"
            date={watchDob ?? undefined}
            onDateChange={(date) => setValue('dob', date)}
          />
          <FormErrorMessage>{errors.dob?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="mobile"
          isRequired
          isInvalid={!!errors.mobile}
          isReadOnly={updateMeMutation.isLoading}
          w={desktop ? '50%' : '80%'}
        >
          <FormLabel>Mobile</FormLabel>
          <Input
            {...register('mobile')}
            placeholder="Mobile"
            borderRadius={'15px'}
            w="100%"
          />
          <FormErrorMessage>{errors.mobile?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="email"
          isRequired
          isInvalid={!!errors.email}
          isReadOnly={updateMeMutation.isLoading}
          w={desktop ? '50%' : '80%'}
        >
          <FormLabel>Email</FormLabel>
          <Input
            {...register('email')}
            placeholder="Email"
            borderRadius={'15px'}
            w="100%"
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>
        <Button
          onClick={async () => {
            console.log(getValues())
            await handleUpdate()
          }}
          isLoading={updateMeMutation.isLoading}
          bgColor={'black'}
          color="white"
          borderRadius={'15px'}
          w={desktop ? '50%' : '80%'}
        >
          Update
        </Button>
      </Stack>
    </>
  )
}
export default Profile
