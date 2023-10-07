import * as React from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import {SignIn} from './index'
import CircularProgress from '@mui/material/CircularProgress'
import VAZIRMATN_FONT from 'util/share-font'
import PropTypes from 'prop-types'

export const AuthContext = React.createContext({
  isAuth: Boolean,
  onUpdateAuthState: () => {},
})

export default function Authentication({children, ...props}) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const isToken = JSON.parse(localStorage.getItem('token')) !== null

    if (isToken) {
      setIsAuthenticated(true)
    }

    setIsLoading(false)
  }, [])

  const value = {isAuth: isAuthenticated, onUpdateAuthState: setIsAuthenticated}

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <Box
          sx={{
            width: '100%',
            height: '100dvh',
            display: 'grid',
            placeContent: 'center',
          }}
        >
          <CircularProgress size={50} />
        </Box>
      ) : isAuthenticated ? (
        <>{children}</>
      ) : (
        <AuthenticationPage {...props} />
      )}
    </AuthContext.Provider>
  )
}

function AuthenticationPage({...props}) {
  const [value, setValue] = React.useState(0)

  function handleChangeTabs(event, newValue) {
    setValue(newValue)
  }

  return (
    <Box className={VAZIRMATN_FONT.className}>
      <Stack
        sx={{
          width: '35%',
          minWidth: '18rem',
          alignItems: 'center',
          border: '4px dotted',
          borderColor: 'primary.main',
          borderRadius: 'var(--md-corner)',
          pt: 2,
          mt: '3rem',
          ml: 'auto',
          mr: 'auto',
        }}
        {...props}
      >
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <Tabs value={value} onChange={handleChangeTabs}>
            <Tab label="ورود کاربر" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <SignIn />
        </CustomTabPanel>
      </Stack>
    </Box>
  )
}

function CustomTabPanel({children, value, index, ...other}) {
  return (
    <Box hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{p: 3}}>{children}</Box>}
    </Box>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}
