import { Box } from '@chakra-ui/react'
import { Navbar } from '~/features/common/components'
import { DonationForm } from '~/features/donations'

export const CreateDonation = (): JSX.Element => {
  return (
    <Box m={0} w={'100%'}>
      {' '}
      <Navbar />
      <DonationForm />
    </Box>
  )
}

export default CreateDonation
