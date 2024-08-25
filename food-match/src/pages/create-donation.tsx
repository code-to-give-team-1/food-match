import { Stack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useLoginState } from '~/features/auth'
import { Navbar } from '~/features/common/components'
import { DonationForm } from '~/features/donations'

export const CreateDonation = (): JSX.Element => {
  const { hasLoginStateFlag } = useLoginState()
  const router = useRouter()
  if (!hasLoginStateFlag) {
    void router.push('/sign-in')
  }
  return (
    <Stack m={0} w={'100%'}>
      <Navbar />
      <DonationForm />
    </Stack>
  )
}

export default CreateDonation
