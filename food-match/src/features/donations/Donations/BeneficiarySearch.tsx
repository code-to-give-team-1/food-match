import {
  Box,
  Button,
  HStack,
  Input,
  Select,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Search2Icon } from '@chakra-ui/icons'

export const BeneficiarySearch = () => {
  const [query, setQuery] = useState('')
  const [preferences, setPreferences] = useState('')

  return (
    <Box w="100%">
      {/* Search Inputs */}
      <HStack w="100%" gap={20}>
        {/* TODO: Implement form */}
        <Input
          borderRadius={'15px'}
          h={'25px'}
          flex={6}
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try: 'Meat and vegetables' "
          value={query}
        />
        {/* TODO: Implement multiselect for preferences */}
        <Select
          placeholder="Preferences"
          borderRadius={'15px'}
          h={'30px'}
          flex={1}
          onChange={(e) => setPreferences(e.target.value)}
          value={preferences}
        >
          <option value="halal">Halal</option>
          <option value="vegan">Vegan</option>
          <option value="kosher">Kosher</option>
        </Select>
        <Button
          leftIcon={<Search2Icon />}
          color={'white'}
          flex={1}
          h={'30px'}
          bgColor={'black'}
          borderRadius={'15px'}
        >
          Search
        </Button>
      </HStack>
      {/* Search results from postgres */}
      <Text marginBlock={10} fontSize={20}>
        Search Result for ""
      </Text>
      {/* TODO: Pull data from postgres in parent component and display number of results */}
      <Text marginBlock={10}>X results found</Text>
    </Box>
  )
}
