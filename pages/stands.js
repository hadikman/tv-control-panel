import Head from 'next/head'
import StandsPage from 'components/page/page.stands'

export default function Stands() {
  return (
    <>
      <Head>
        <title>مدیریت استندها</title>
        <meta name="description" content="کنترل پنل تلویزیون" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <StandsPage />
    </>
  )
}
