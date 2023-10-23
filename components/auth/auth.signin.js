import * as React from 'react'
import {AuthContext} from './auth'
import axiosClient from 'util/axios-http'
import {LOGIN_API} from 'util/api-url'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {keyframes} from '@mui/material'

const DISPLAY_LOADING_PANEL = 1750

const bblFadInOut = keyframes({
  '0%, 80%, 100%': {boxShadow: '0 2.5em 0 -1.3em'},
  '40%': {boxShadow: '0 2.5em 0 0 '},
})

async function fetchLoginData(userData) {
  let response

  try {
    response = await axiosClient.post(LOGIN_API, userData)
    response = response.data
  } catch (error) {
    response = error

    if (response.status !== 200) {
      console.error(`Error code: ${error.response.status}`)
    }
  }

  return response
}

function SignIn() {
  const {onUpdateAuthState} = React.useContext(AuthContext)
  const [isLoadingPanel, setIsLoadingPanel] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const isError = errorMessage !== ''

  const handleOnSubmitForm = async event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsLoadingPanel(true)

    if (isError) {
      setErrorMessage('')
    }

    const userData = {
      username: formData.get('username').trim(),
      password: formData.get('password').trim(),
    }

    const data = await fetchLoginData(userData)

    if (data.success) {
      let timeout

      localStorage.setItem('token', JSON.stringify(data.data.token))

      timeout = setTimeout(() => {
        onUpdateAuthState(true)
        setIsLoadingPanel(false)
        clearTimeout(timeout)
      }, DISPLAY_LOADING_PANEL)
    } else if (data.response.status === 403) {
      setErrorMessage('نام کاربری/رمز عبور اشتباه است')
      setIsLoadingPanel(false)
    } else if (data.response.status >= 500) {
      setErrorMessage('عدم دسترسی به سرور')
      setIsLoadingPanel(false)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ورود به پنل
        </Typography>
        <Box
          component="form"
          onSubmit={handleOnSubmitForm}
          noValidate
          sx={{mt: 1}}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="نام کاربری"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="رمز عبور"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
          >
            ورود
          </Button>
        </Box>

        {isError && (
          <Snackbar open={isError}>
            <Typography
              variant="body2"
              sx={{
                bgcolor: 'error.light',
                color: 'error.contrastText',
                borderRadius: 'var(--sm-corner)',
                p: 1,
              }}
            >
              {`${errorMessage}، .دوباره تلاش نمایید`}
            </Typography>
          </Snackbar>
        )}

        {isLoadingPanel ? (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(5px)',
              zIndex: 10000,
              '.loader-panel, .loader-panel:before, .loader-panel:after': {
                width: '2.5em',
                height: '2.5em',
                borderRadius: '50%',
                animationFillMode: 'both',
                animation: `${bblFadInOut} 1.8s infinite ease-in-out`,
              },
              '.loader-panel': {
                fontSize: '4px',
                textIndent: '-9999em',
                color: 'darkClr.main',
                transform: 'translateZ(0)',
                animationDelay: '-0.16s',
                position: 'relative',
              },
              '.loader-panel:before, .loader-panel:after': {
                content: '""',
                position: 'absolute',
                top: '0',
              },
              '.loader-panel:before': {
                left: '-3.5em',
                animationDelay: '-0.32s',
              },
              '.loader-panel:after': {
                left: '3.5em',
              },
            }}
          >
            <Box
              sx={{
                width: '60%',
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
                mx: 'auto',
              }}
            >
              <Typography variant="h6" sx={{color: 'darkClr.main'}}>
                در حال ورود به حساب کاربری
              </Typography>
              <Box className="loader-panel"></Box>
            </Box>
          </Box>
        ) : null}
      </Box>
    </Container>
  )
}

export {SignIn}
