import * as React from 'react'
import {useRouter} from 'next/router'
import {Transition} from 'react-transition-group'
import Box from '@mui/material/Box'
import {keyframes} from '@mui/material'

const duration = 1200
const modalTransitionStyle = {
  entering: {opacity: 0},
  entered: {opacity: 1},
  exiting: {opacity: 0.2},
  exited: {opacity: 0},
}

const rotation = keyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(360deg)',
  },
})
const rotationBack = keyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(-360deg)',
  },
})

function LoadingBetweenPages() {
  const modalRef = React.useRef()
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const isLoading = loading

  React.useEffect(() => {
    let timeout

    function handleRouteChangeStart(url) {
      if (url !== router.asPath) {
        setLoading(true)
      }
    }
    function handleRouteChangeComplete() {
      setLoading(false)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    router.events.on('routeChangeError', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
      router.events.off('routeChangeError', handleRouteChangeComplete)
      clearTimeout(timeout)
    }
  }, [router.asPath, router.events])

  return isLoading ? (
    <Transition nodeRef={modalRef} in={isLoading} timeout={duration}>
      {style => (
        <Box
          sx={{
            position: 'fixed',
            inset: '0',
            width: '100%',
            height: '100vh',
            display: 'grid',
            placeContent: 'center',
            bgcolor: 'hsl(0 0% 10% / 0.55)',
            color: '#fff',
            zIndex: 10000,
            transition: `${duration}ms ease-in-out`,
            ...modalTransitionStyle[style],
          }}
          ref={modalRef}
        >
          <Box
            sx={{
              '--spinner-size': '72px',
              '--spinner-thickess': '3px',
              '--rotate-speed': '2.5s',
              width: 'var(--spinner-size)',
              height: 'var(--spinner-size)',
              display: 'inline-block',
              border: 'var(--spinner-thickess) dotted hsl(0 0% 100%)',
              borderStyle: 'solid solid dotted dotted',
              borderRadius: '50%',
              position: 'relative',
              animation: `${rotation} var(--rotate-speed) linear infinite`,
              '::after': {
                content: '""',
                boxSizing: 'border-box',
                position: 'absolute',
                left: '0',
                right: '0',
                top: '0',
                bottom: '0',
                width: 'calc(var(--spinner-size) / 2)',
                height: 'calc(var(--spinner-size) / 2)',
                border: 'var(--spinner-thickess) dotted hsl(20 100% 50%)',
                borderStyle: 'solid solid dotted',
                borderRadius: '50%',
                m: 'auto',
                transformOrigin: 'center center',
                animation: `${rotationBack} calc(var(--rotate-speed) * 0.4) linear infinite`,
              },
            }}
          ></Box>
        </Box>
      )}
    </Transition>
  ) : null
}

export default LoadingBetweenPages
