import Head from 'next/head'
import ZonePage from 'components/page/page.zones'

export default function Zones() {
  return (
    <>
      <Head>
        <title>زون ها</title>
        <meta name="description" content="کنترل پنل تلویزیون" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ZonePage />
    </>
  )
}
