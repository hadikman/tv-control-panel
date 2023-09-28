import Head from 'next/head'
import HomePage from 'components/page/page.home'

export default function Home() {
  return (
    <>
      <Head>
        <title>داشبورد</title>
        <meta name="description" content="کنترل پنل تلویزیون" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomePage />
    </>
  )
}
