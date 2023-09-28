import localFont from 'next/font/local'

const VAZIRMATN_FONT = localFont({
  src: [
    {
      path: '../assets/fonts/Vazirmatn-FD-Light.woff2',
      weight: '300',
      style: 'normal',
      variable: '--ff-300',
    },
    {
      path: '../assets/fonts/Vazirmatn-FD-Regular.woff2',
      weight: '400',
      style: 'normal',
      variable: '--ff-400',
    },
    {
      path: '../assets/fonts/Vazirmatn-FD-Bold.woff2',
      weight: '700',
      style: 'normal',
      variable: '--ff-700',
    },
  ],
})

export default VAZIRMATN_FONT
