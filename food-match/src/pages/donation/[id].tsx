import { Text } from '@chakra-ui/react'
import { Navbar } from '~/features/common/components'
import { trpc } from '~/utils/trpc'
import { useRouter } from 'next/router'
import { DonationItemPage } from '~/features/donations'

const DonationItem = () => {
  const router = useRouter()
  const { id } = router.query // Access the dynamic route parameter
  const donationId = Array.isArray(id) ? id[0] : id || ''
  // Using the useQuery hook from tRPC
  if (donationId) {
    const { data, isLoading, error } = trpc.donation.getDonation.useQuery({
      donationId,
    })
    return (
      <>
        <Navbar />
        {isLoading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>Error: {error.message}</Text>
        ) : (
          <DonationItemPage item={data} />
        )}
      </>
    )
  } else {
    return (
      <>
        <Navbar /> <Text>This item cannot be found.</Text>
      </>
    )
  }
}

export default DonationItem
