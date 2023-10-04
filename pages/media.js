import Head from 'next/head'
import MediaPage from 'components/page/page.media'

export default function Media() {
  return (
    <>
      <Head>
        <title>رسانه‌ها</title>
        <meta name="description" content="کنترل پنل تلویزیون" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MediaPage />
    </>
  )
}
