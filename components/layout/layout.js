import {Header, Main, Footer} from './index'
import VAZIRMATN_FONT from 'util/share-font'

function Layout({children}) {
  return (
    <>
      <Header className={VAZIRMATN_FONT.className} />
      <Main className={VAZIRMATN_FONT.className}>{children}</Main>
      <Footer className={VAZIRMATN_FONT.className} />
    </>
  )
}

export {Layout}
