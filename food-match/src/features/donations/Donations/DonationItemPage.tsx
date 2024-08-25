import { AtSignIcon, CalendarIcon, InfoIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Stack,
  Text,
  Image,
  useMediaQuery,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { trpc, type RouterOutput } from '~/utils/trpc'
import { useState } from 'react'
import { useLoginState } from '~/features/auth'
import { useRouter } from 'next/router'

export type DonationItemType =
  | {
      id: string
      name: string
      tagsIds: string[]
      imageUrls: string[]
      description: string
      expiry: Date
      quantity: string
      passCode: string | null
      donorId: string
      beneficiaryId: string | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }
  | null
  | undefined

export const DonationItemPage = ({
  item,
}: {
  item: RouterOutput['donation']['getDonation']
}) => {
  const [desktop] = useMediaQuery('(min-width: 600px)')
  const [passCode, setPassCode] = useState('')
  const utils = trpc.useUtils()
  const claimDonationMutation = trpc.donation.claimDonation.useMutation({
    onSuccess: (pc) => {
      void utils.donation.invalidate()
      setPassCode(String(pc))
    },
    onError: (error) => {
      console.error(error)
    },
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { hasLoginStateFlag } = useLoginState()
  const router = useRouter()
  if (!hasLoginStateFlag) {
    void router.push('/sign-in')
  }
  // const desktop = false
  const formatISOString = (date: Date): string => {
    return (
      date.getUTCDate() + '/' + date.getUTCMonth() + '/' + date.getUTCFullYear()
    )
  }

  if (item) {
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Claim Donation?</ModalHeader>
            <ModalCloseButton />
            {passCode ? (
              <ModalBody pb="1rem">
                <Text>
                  You have successfully claimed this donation. Your passcode is{' '}
                  <b>{passCode}</b>. Please use this passcode to collect the
                  item.
                </Text>
              </ModalBody>
            ) : (
              <>
                <ModalBody>
                  <Text>
                    Are you sure you want to claim this donation? You will be
                    responsible for collecting the item.
                  </Text>
                </ModalBody>
                <ModalFooter gap="1rem">
                  <Button
                    bgColor={'black'}
                    color={'white'}
                    onClick={() =>
                      claimDonationMutation.mutate({ id: item.id })
                    }
                    isLoading={claimDonationMutation.isLoading}
                  >
                    Claim this donation
                  </Button>
                  <Button variant="ghost" mr={3} onClick={() => onClose()}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Stack
          padding={'2rem'}
          marginBlock={'10vh'}
          boxSizing="border-box"
          h={'70vh'}
          w={'100%'}
          align={'start'}
          gap={'2rem'}
          direction={desktop ? 'row' : 'column'}
        >
          <Image
            src={`${
              item.imageUrls.length > 0
                ? item.imageUrls[0]
                : '/images/placeholder.png'
            }`}
            alt="Item Image"
            border={'1px solid black'}
            borderRadius={'15px'}
            w={desktop ? '40%' : '100%'}
            h={'100%'}
            objectFit={'contain'}
          />
          <Stack h={'100%'} spacing="1rem">
            <Box>
              <Text as="b">{item.name}</Text>
              <Text color={'gray'}>
                <CalendarIcon /> Expiry Date: {formatISOString(item.expiry)}
              </Text>
              <Text color={'gray'}>
                <InfoIcon /> Quantity: {item.quantity}
              </Text>
              {item.tags.length > 0 && (
                <Text color={'gray'}>
                  <InfoIcon /> Tags:{' '}
                  {item.tags.map((tag) => tag.name).join(', ')}
                </Text>
              )}
              <Text color={'gray'}>
                <AtSignIcon /> Donor: {item.donor.name}
              </Text>
            </Box>

            <Box>
              <Text>The donor says: {item.description}</Text>
            </Box>
            <Stack spacing="1rem">
              {' '}
              <Text color={'gray'}>
                Created At: {formatISOString(item.createdAt)}
              </Text>
              {!item.beneficiary ? (
                <Button
                  bgColor={'black'}
                  color={'white'}
                  borderRadius={'15px'}
                  onClick={onOpen}
                >
                  I want to collect this item
                </Button>
              ) : (
                <Text>
                  This item is being collected by user {item.beneficiary.name}.
                </Text>
              )}
            </Stack>
          </Stack>
        </Stack>
      </>
    )
  } else {
    return <Text>Item not found</Text>
  }
}
