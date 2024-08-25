import '@fontsource/ibm-plex-mono' // Import if using code textStyles.
import 'inter-ui/inter.css' // Strongly recommended.
import '../styles/main.css'

import { Skeleton, Stack, ChakraProvider } from '@chakra-ui/react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { AppProps, AppType } from 'next/app'
import Suspense from '~/components/Suspense'
import { type NextPageWithLayout } from '~/lib/types'
import { DefaultLayout } from '~/templates/layouts/DefaultLayout'
import { trpc } from '~/utils/trpc'
import { EnvProvider } from '~/components/AppProviders'
import { LoginStateProvider } from '~/features/auth'
import { env } from '~/env.mjs'
import { ErrorBoundary } from 'react-error-boundary'
import { DefaultFallback } from '~/components/ErrorBoundary/DefaultFallback'
import { theme } from '~/theme'

type AppPropsWithAuthAndLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ((props: AppPropsWithAuthAndLayout) => {
  return (
    <EnvProvider env={env}>
      <ChakraProvider theme={theme}>
        <LoginStateProvider>
          <ErrorBoundary FallbackComponent={DefaultFallback}>
            <Suspense fallback={<Skeleton width="100vw" />}>
              <Stack spacing={0} minH="$100vh">
                <ChildWithLayout {...props} />
                {process.env.NODE_ENV !== 'production' && (
                  <ReactQueryDevtools initialIsOpen={false} />
                )}
              </Stack>
            </Suspense>
          </ErrorBoundary>
        </LoginStateProvider>
      </ChakraProvider>
    </EnvProvider>
  )
}) as AppType

// This is needed so suspense will be triggered for anything within the LayoutComponents which uses useSuspenseQuery
const ChildWithLayout = ({
  Component,
  pageProps,
}: AppPropsWithAuthAndLayout) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)

  return <>{getLayout(<Component {...pageProps} />)}</>
}

export default trpc.withTRPC(MyApp)
