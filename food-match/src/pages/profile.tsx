import { useMe } from '~/features/me/api'
// import { getIsProfileComplete } from '~/server/modules/me/me.util'
import {
  FormControl,
  FormLabel,
  Stack,
  Input,
  FormErrorMessage,
  Button,
} from '@chakra-ui/react'
import { useZodForm } from '~/lib/form'
import { updateMeSchema } from '~/schemas/me'
import { trpc } from '~/utils/trpc'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Navbar } from '~/features/common/components'

export const Profile = () => {
  const { me } = useMe()
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
    onSuccess: () => {},
    onError: (error) => {
      setError('name', { message: error.message })
    },
  })

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
        pt="1rem"
      >
        <FormControl
          id="name"
          isRequired
          isInvalid={!!errors.name}
          isReadOnly={updateMeMutation.isLoading}
          w="20rem"
        >
          <FormLabel>Name</FormLabel>
          <Input
            {...register('name')}
            placeholder="Name"
            borderRadius={'15px'}
            textIndent={'0.5rem'}
            h="1rem"
            w="100%"
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="dob"
          isRequired
          isInvalid={!!errors.dob}
          isReadOnly={updateMeMutation.isLoading}
          w="20rem"
        >
          <FormLabel>Date of Birth</FormLabel>
          <DatePicker
            selected={watchDob}
            onChange={(date) => setValue('dob', date)}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
          />
          <FormErrorMessage>{errors.dob?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="mobile"
          isRequired
          isInvalid={!!errors.mobile}
          isReadOnly={updateMeMutation.isLoading}
          w="20rem"
        >
          <FormLabel>Mobile</FormLabel>
          <Input
            {...register('mobile')}
            placeholder="Mobile"
            borderRadius={'15px'}
            textIndent={'0.5rem'}
            h="1rem"
            w="100%"
          />
          <FormErrorMessage>{errors.mobile?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          id="email"
          isRequired
          isInvalid={!!errors.email}
          isReadOnly={updateMeMutation.isLoading}
          w="20rem"
        >
          <FormLabel>Email</FormLabel>
          <Input
            {...register('email')}
            placeholder="Email"
            borderRadius={'15px'}
            textIndent={'0.5rem'}
            h="1rem"
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
          h="2rem"
          w="20rem"
        >
          Update
        </Button>
      </Stack>
    </>
  )
}
export default Profile
