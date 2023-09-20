import Head from 'next/head'
import HomePage from 'components/home-page'
import VAZIRMATN_FONT from 'util/share-font'

export default function Home() {
  return (
    <>
      <Head>
        <title>داشبورد</title>
        <meta name="description" content="کنترل پنل تلویزیون" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomePage className={VAZIRMATN_FONT.className} />
    </>
  )
}
