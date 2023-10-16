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

async function fetchLoginData(userData) {
  const response = await axiosClient.post(LOGIN_API, userData)

  if (response.status !== 200) {
    console.error('Login failed, try again.')
  }

  return response
}

function SignIn() {
  const {onUpdateAuthState} = React.useContext(AuthContext)
  const [isError, setIsError] = React.useState(false)

  const handleOnSubmitForm = async event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setIsError(false)

    const userData = {
      username: formData.get('username'),
      password: formData.get('password'),
    }

    const fetchedLoginData = await fetchLoginData(userData)
    const {data: loginData} = fetchedLoginData
    const {success, data} = loginData

    if (success) {
      localStorage.setItem('token', JSON.stringify(data.token))
      onUpdateAuthState(true)
    } else {
      setIsError(true)
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
              خطایی رخ داده است، دوباره تلاش نمایید
            </Typography>
          </Snackbar>
        )}
      </Box>
    </Container>
  )
}

export {SignIn}
