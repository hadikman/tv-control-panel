import 'styles/globals.scss'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import CustomizedThemeProvider from 'util/customize-theme-provider'
import {CacheProvider} from '@emotion/react'
import createCache from '@emotion/cache'
import Authentication from 'components/auth/auth'
import {Layout} from 'components/layout/layout'
import rtlPlugin from 'stylis-plugin-rtl'

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
})

const queryClient = new QueryClient()

export default function App({Component, pageProps}) {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomizedThemeProvider>
        <CacheProvider value={cacheRtl}>
          <Authentication>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Authentication>
        </CacheProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </CustomizedThemeProvider>
    </QueryClientProvider>
  )
}
