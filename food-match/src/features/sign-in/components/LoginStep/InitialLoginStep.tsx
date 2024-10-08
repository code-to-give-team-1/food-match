import { Stack, Text } from '@chakra-ui/react'

import { EmailLoginForm } from '../EmailLogin'
import { useEnv } from '~/hooks/useEnv'

export const InitialLoginStep = (): JSX.Element => {
  const {
    env: { NEXT_PUBLIC_APP_NAME: title },
  } = useEnv()

  return (
    <Stack gap="2rem" direction="column" width="100%">
      <Text color="base.content.brand" textStyle="h3-semibold">
        {title}
      </Text>
      <EmailLoginForm />
    </Stack>
  )
}
