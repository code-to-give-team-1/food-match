import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useZodForm } from '~/lib/form'
import { donationSchema } from '~/schemas/donation/donation'
import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'

export const DonationForm = () => {
  // Use Zod + React Hook Form to enforce error checking and submission
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useZodForm({
    schema: donationSchema,
    mode: 'onSubmit',
  })
  const router = useRouter()

  // Use mutations to create an entry in Postgres
  const createDonationMutation = trpc.donation.createDonation.useMutation({
    // onSuccess actions can be put here
    onSuccess: () => router.push('/home'),
    onError: (error) => setError('name', { message: error.message }),
  })

  // Handles the form submission
  const handleCreateDonation = handleSubmit((data) => {
    // Fill in the remaining manually first
    // TODO: Remove when able to process all fields
    const processedData = {
      ...data,
      // Example: add or modify fields as needed
      tagIds: [],
      imageIds: [],
      passCode: undefined,
      beneficiaryId: '',
      donorId: 'testDonorId',
    }

    return createDonationMutation.mutate(data)
  })

  // Abstracted form input
  // TODO: type validation
  const FormInput = React.memo(
    ({ id, label, placeholder, register, errors, isRequired = false }: any) => (
      <FormControl id={id} isRequired={isRequired} isInvalid={!!errors[id]}>
        <FormLabel marginBottom="5px">{label}</FormLabel>
        <Input
          borderRadius="15px"
          width="200px"
          height="20px"
          placeholder={placeholder}
          {...register(id)}
        />
        <FormErrorMessage color={'red'} fontSize={'0.8em'}>
          {errors[id]?.message}
        </FormErrorMessage>
      </FormControl>
    ),
  )

  return (
    <form onSubmit={handleCreateDonation} noValidate>
      <Stack spacing="1rem">
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
        <FormInput
          id="expiry"
          label="When will it expire? (indicate in YYYY-MM-DD format)"
          placeholder="e.g. 2024-10-30"
          register={register}
          errors={errors}
          isRequired
        />
        {/* Quantity */}
        <FormInput
          id="quantity"
          label="Quantity to Donate"
          placeholder="e.g. 1"
          register={register}
          errors={errors}
          isRequired
        />

        <Button
          size="xs"
          height="2.75rem"
          type="submit"
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
  )
}
