import {
  Box,
  Flex,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Stack,
  useMediaQuery,
} from '@chakra-ui/react'
import Image from 'next/image'
import { HamburgerIcon, CloseIcon, ArrowDownIcon } from '@chakra-ui/icons'
import { useMe } from '~/features/me/api'
import { useRouter } from 'next/router'

const Links: LinkProp[] = [
  {
    name: 'Donations',
    href: '/home',
  },
  {
    name: 'Statistics',
    href: '#',
  },
  {
    name: 'Create Donation',
    href: '/create-donation',
  },
]

interface LinkProp {
  name: string
  href: string
}

const NavLink = ({ name, href }: LinkProp) => {
  return (
    <Box
      as="a"
      rounded={'md'}
      textDecoration={'none'}
      _hover={{
        textDecoration: 'none',
        bg: 'black',
      }}
      borderRadius={'10px'}
      href={href}
      color={'white'}
      px="1rem"
      py="0.5rem"
    >
      {name}
    </Box>
  )
}

export const Navbar = () => {
  const [desktop] = useMediaQuery('(min-width: 600px)')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { me, logout } = useMe()
  const router = useRouter()

  return (
    <Box
      bg={'#191919'}
      color={'white'}
      px={desktop ? '2rem' : ''}
      position="fixed"
      top="0"
      w="full"
      zIndex={9999}
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        {!desktop && (
          <HStack spacing="1rem">
            <IconButton
              size={'md'}
              icon={
                isOpen ? (
                  <CloseIcon color="black" />
                ) : (
                  <HamburgerIcon color="black" />
                )
              }
              aria-label={'Open Menu'}
              display={desktop ? 'none' : ''}
              onClick={isOpen ? onClose : onOpen}
              color="white"
              ml="1rem"
            />
            <Image
              src={'/images/main_page_logo.png'}
              width={70}
              height={25}
              alt="Logo"
              onClick={() => router.push('/home')}
            />
          </HStack>
        )}

        <HStack alignItems={'center'}>
          {desktop && (
            <Image
              src={'/images/main_page_logo.png'}
              width={70}
              height={25}
              alt="Logo"
              onClick={() => router.push('/home')}
            />
          )}
          <HStack
            as={'nav'}
            spacing="2rem"
            pl="1rem"
            display={desktop ? 'flex' : 'none'}
          >
            {Links.map(({ name, href }) => (
              <NavLink key={name} name={name} href={href} />
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'} pr="1rem">
          <Menu>
            <MenuButton
              as={Button}
              borderRadius={'full'}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
              backgroundColor={'transparent'}
              border={'none'}
            >
              <HStack>
                <Image
                  src="/images/avatar.png"
                  alt="Avatar"
                  width={25}
                  height={25}
                  layout="intrinsic" // Ensure proper sizing and layout
                />
                <Text color={'white'}>{me.name}</Text>
                <ArrowDownIcon color={'white'} />
              </HStack>
            </MenuButton>
            <MenuList zIndex={9999} bg="black">
              <MenuItem
                cursor={'pointer'}
                bg="black"
                onClick={() => router.push('/profile')}
              >
                Profile
              </MenuItem>
              <MenuItem bg="black" onClick={() => logout()} cursor={'pointer'}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box display={desktop ? 'none' : ''} pb="1rem">
          <Stack as={'nav'}>
            {Links.map(({ name, href }) => (
              <NavLink key="name" name={name} href={href}></NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}

export const UnauthedNavbar = () => {
  const [desktop] = useMediaQuery('(min-width: 600px)')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  return (
    <Box
      bg={'#191919'}
      color={'white'}
      px={desktop ? '2rem' : ''}
      position="fixed"
      top="0"
      w="full"
      zIndex={9999}
    >
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        {!desktop && (
          <HStack spacing="1rem">
            <IconButton
              size={'md'}
              icon={
                isOpen ? (
                  <CloseIcon color="black" />
                ) : (
                  <HamburgerIcon color="black" />
                )
              }
              aria-label={'Open Menu'}
              display={desktop ? 'none' : ''}
              onClick={isOpen ? onClose : onOpen}
              color="white"
              ml="1rem"
            />
            <Image
              src={'/images/main_page_logo.png'}
              width={70}
              height={25}
              alt="Logo"
              onClick={() => router.push('/home')}
            />
          </HStack>
        )}

        <HStack alignItems={'center'}>
          {desktop && (
            <Image
              src={'/images/main_page_logo.png'}
              width={70}
              height={25}
              alt="Logo"
              onClick={() => router.push('/home')}
            />
          )}
          <HStack
            as={'nav'}
            spacing="2rem"
            pl="1rem"
            display={desktop ? 'flex' : 'none'}
          >
            {Links.map(({ name, href }) => (
              <NavLink key={name} name={name} href={href} />
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'} pr="1rem">
          <Menu>
            <MenuButton
              as={Button}
              borderRadius={'full'}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
              backgroundColor={'transparent'}
              border={'none'}
            >
              <HStack>
                <Image
                  src="/images/avatar.png"
                  alt="Avatar"
                  width={25}
                  height={25}
                  layout="intrinsic" // Ensure proper sizing and layout
                />
                <ArrowDownIcon color={'white'} />
              </HStack>
            </MenuButton>
            <MenuList zIndex={9999} bg="black">
              <MenuItem
                cursor={'pointer'}
                bg="black"
                onClick={() => router.push('/profile')}
              >
                Profile
              </MenuItem>
              <MenuItem
                bg="black"
                onClick={() => router.push('/sign-in')}
                cursor={'pointer'}
              >
                Login
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box display={desktop ? 'none' : ''} pb="1rem">
          <Stack as={'nav'}>
            {Links.map(({ name, href }) => (
              <NavLink key="name" name={name} href={href}></NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}
