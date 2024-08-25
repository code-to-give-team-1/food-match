import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useMediaQuery,
} from '@chakra-ui/react'
import React from 'react'
import { useZodForm } from '~/lib/form'
import { clientAddDonationSchema } from '~/schemas/donation/donation'
import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'
import { useMe } from '~/features/me/api'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { type z } from 'zod'
import { ImageAttachmentButton } from '~/components/ImageAttachmentButton'
import { useUploadImagesMutation } from '~/hooks/useUploadImagesMutation'

export const DonationForm = () => {
  // Use Zod + React Hook Form to enforce error checking and submission
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,

    formState: { errors },
  } = useZodForm({
    schema: clientAddDonationSchema,
    mode: 'onSubmit',
  })
  const router = useRouter()
  const watchExpiry = watch('expiry')
  const [desktop] = useMediaQuery('(min-width: 600px)')

  const { me } = useMe()
  const uploadImagesMutation = useUploadImagesMutation()
  // console.log(me)
  // Use mutations to create an entry in Postgres
  const createDonationMutation = trpc.donation.createDonation.useMutation({
    // onSuccess actions can be put here
    onSuccess: () => router.push('/home'),
    onError: (error) => setError('name', { message: error.message }),
  })

  // Handles the form submission
  const handleCreateDonation = handleSubmit((data) => {
    return uploadImagesMutation.mutate(data.images, {
      onSuccess: (uploadedImageKeys) => {
        return createDonationMutation.mutate({
          name: data.name,
          description: data.description,
          expiry: data.expiry,
          quantity: data.quantity,
          donorId: me.id,
          imageKeys: uploadedImageKeys,
          // tagIds
        })
      },
    })
    // Fill in the remaining manually first
    // TODO: Remove when able to process all fields
  }, console.error)

  // Abstracted form input
  // TODO: type validation
  const FormInput = React.memo(
    ({
      id,
      label,
      placeholder,
      register,
      errors,
      isRequired = false,
    }: {
      id: keyof z.infer<typeof clientAddDonationSchema>
      label: string
      placeholder: string
      register: UseFormRegister<z.infer<typeof clientAddDonationSchema>>
      errors: FieldErrors<z.infer<typeof clientAddDonationSchema>>
      isRequired?: boolean
    }) => (
      <FormControl id={id} isRequired={isRequired} isInvalid={!!errors[id]} justifyContent="center">
        <FormLabel marginBottom="5px">{label}</FormLabel>
        <Input
          borderRadius="15px"
          placeholder={placeholder}
          {...register(id)}
        />
        <FormErrorMessage color={'red'} fontSize={'0.8em'}>
          {errors[id]?.message}
        </FormErrorMessage>
      </FormControl>
    ),
  )

  FormInput.displayName = 'FormInput'

  return (
    <Box alignItems={'center'} justifyContent="center">
    <form onSubmit={handleCreateDonation} noValidate>
      <Stack w={desktop ? '50%' : '80%'} alignItems={'center'} spacing="1rem" justifyContent="center">
      {/* Item Name */}
        <FormInput
          id="name"
          label="Name of item to donate"
          placeholder="e.g. Luncheon Meat"
          register={register}
          errors={errors}
          isRequired
        />
        {/* TODO: Dropdown for tags */}
        {/* TODO: Image urls */}
        {/* Description */}
        <FormInput
          id="description"
          label="Description"
          placeholder="e.g. Unused food from our kitchen"
          register={register}
          errors={errors}
          isRequired
        />
        {/* Expiry */}
        <FormControl
          id="expiry"
          isRequired
          // isInvalid={!!errors.dob}
          // isReadOnly={updateMeMutation.isLoading}
          // w="20rem"
        >
          <FormLabel>Expiry Date</FormLabel>
          <DatePicker
            selected={watchExpiry}
            onChange={(date) => date && setValue('expiry', date)}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
          />
          <FormErrorMessage>{errors.expiry?.message}</FormErrorMessage>
        </FormControl>
        {/* Quantity */}
        <FormInput
          id="quantity"
          label="Quantity to Donate"
          placeholder="e.g. 1"
          register={register}
          errors={errors}
          isRequired
        />
        <FormControl id="imageUrls">
          <ImageAttachmentButton
            onChange={(files) => {
              setValue('images', files)
            }}
            value={[]}
          />
        </FormControl>
        {/* Submit */}
        <Button
          onClick={async () => {
            await handleCreateDonation()
          }}
          size="xs"
          height="2.75rem"
          bgColor={'black'}
          color="white"
          borderRadius={'15px'}
          width={'200px'}
          cursor={'pointer'}
          isLoading={createDonationMutation.isLoading}
        >
          Create Donation
        </Button>
      </Stack>
    </form>
    </Box>
  )
}
