import * as React from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import {SignIn, SignUp} from './index'
import VAZIRMATN_FONT from 'util/share-font'
import PropTypes from 'prop-types'

export default function Authentication({children, ...props}) {
  const isAuthenticated = true

  return isAuthenticated ? <>{children}</> : <Auth {...props} />
}

function Auth({...props}) {
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
            <Tab label="ثبت نام کاربر" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <SignIn />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <SignUp />
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
