import { Stack } from '@chakra-ui/react'
import { Navbar } from '~/features/common/components'
import { DonationForm } from '~/features/donations'

export const CreateDonation = (): JSX.Element => {
  return (
    <Stack m={0} w={'100%'}>
      {' '}
      <Navbar />
      <DonationForm />
    </Stack>
  )
}

export default CreateDonation
