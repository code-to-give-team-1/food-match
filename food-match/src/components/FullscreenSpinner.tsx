import { Container, Flex, VisuallyHidden } from '@chakra-ui/react'
import React from 'react'

const Spinner = ({
  color = 'inherit',
  label = 'Loading...',
  ...flexProps
}): JSX.Element => {
  return (
    <Flex color={color} align="center" {...flexProps}>
      {label && <VisuallyHidden>{label}</VisuallyHidden>}
    </Flex>
  )
}

export const FullscreenSpinner = (): JSX.Element => {
  return (
    <Container
      display="flex"
      h="$100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Spinner color="interaction.main.default" fontSize="2rem" />
    </Container>
  )
}
