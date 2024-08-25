import {
  Box,
  Button,
  HStack,
  Input,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { MultiSelect, type Option, useMultiSelect } from 'chakra-multiselect'
import { useState, useMemo } from 'react'
import { trpc } from '~/utils/trpc'

export const BeneficiarySearch = ({
  setOuterQuery,
  setOuterTags,
  count,
  outerQuery,
}: {
  setOuterQuery: (query: string) => void
  setOuterTags: (tags: Option[]) => void
  count: number
  outerQuery: string
}) => {
  const [query, setQuery] = useState('')
  const [tags] = trpc.tag.getAllTags.useSuspenseQuery()
  const optionTags = useMemo(() => {
    return tags.map((tag) => ({ label: tag.name, value: tag.id }))
  }, [tags])
  const { value, options, onChange } = useMultiSelect({
    value: [],
    options: optionTags,
  })

  return (
    <Box w="100%">
      {/* Search Inputs */}
      <Stack w="100%" spacing={4}>
        <HStack w="100%" gap="1rem">
          {/* TODO: Implement form */}
          <Input
            autoFocus
            // debounce search
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: 'Meat and vegetables' "
            value={query}
          />
          {/* TODO: Implement multiselect for preferences */}
          <Button
            leftIcon={<Search2Icon />}
            color={'white'}
            bgColor={'black'}
            borderRadius={'15px'}
            w="8rem"
            onClick={() => {
              setOuterQuery(query)
              console.log(value)
              // value is actually Option but the library says it's string | string[]
              setOuterTags(value as unknown as Option[])
            }}
          >
            Search
          </Button>
        </HStack>
        <HStack w="100%" gap={20}>
          <MultiSelect
            placeholder="Preferences"
            borderRadius={'15px'}
            h={'30px'}
            w="30%"
            flex={1}
            value={value}
            onChange={onChange}
            options={options}
          />
        </HStack>
      </Stack>
      {/* Search results from postgres */}
      {outerQuery && (
        <Text my="1rem" fontSize={20}>
          Search Result for &quot;{outerQuery}&quot;
        </Text>
      )}
      {/* TODO: Pull data from postgres in parent component and display number of results */}
      {count > 0 ? (
        <Text my="1rem">{count} results found</Text>
      ) : (
        <Skeleton height="20px" />
      )}
    </Box>
  )
}
