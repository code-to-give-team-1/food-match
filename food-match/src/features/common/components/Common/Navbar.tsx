import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useMediaQuery,
} from '@chakra-ui/react'
import Image from 'next/image'
import { HamburgerIcon, CloseIcon, ArrowDownIcon } from '@chakra-ui/icons'

const Links = ['Donations', 'Statistics']

interface Props {
  children: React.ReactNode
}

const NavLink = (props: Props) => {
  const { children } = props

  return (
    <Box
      ml={20}
      as="a"
      p={8}
      rounded={'md'}
      textDecoration={'none'}
      _hover={{
        textDecoration: 'none',
        bg: 'black',
      }}
      borderRadius={'10px'}
      href={'#'}
      color={'white'}
    >
      {children}
    </Box>
  )
}

export const Navbar = () => {
  const [desktop] = useMediaQuery('(min-width: 600px)')
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box bg={'#191919'} color={'white'} p={20}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={desktop ? 'none' : ''}
          onClick={isOpen ? onClose : onOpen}
          color="white"
          p={10}
        />

        <HStack spacing={8} alignItems={'center'}>
          <Box>MATCH</Box>
          <HStack as={'nav'} spacing={10} display={desktop ? 'flex' : 'none'}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
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
                <Text color={'white'}>Adam Tan</Text>
                <ArrowDownIcon color={'white'} />
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem backgroundColor={'black'}>Account</MenuItem>
              <MenuDivider />
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pt={10} display={desktop ? 'none' : ''}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}
