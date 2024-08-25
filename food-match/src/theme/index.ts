import { extendTheme } from '@chakra-ui/react'
import { MultiSelectTheme } from 'chakra-multiselect'

export const theme = extendTheme({
  components: {
    MultiSelect: MultiSelectTheme,
  },
})
