import * as React from 'react'
import {AuthContext} from 'components/auth/auth'
import Link from 'next/link'
import {useTheme} from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import HomeIcon from '@mui/icons-material/Home'
import GridViewIcon from '@mui/icons-material/GridView'
import Logout from '@mui/icons-material/Logout'
import PermMediaIcon from '@mui/icons-material/PermMedia'

const menuListItems = [
  {
    name: 'صفحه اصلی',
    icon: <HomeIcon />,
    href: '/',
  },
  {
    name: 'رسانه ها',
    icon: <PermMediaIcon />,
    href: '/media',
  },
  {
    name: 'زون ها',
    icon: <GridViewIcon />,
    href: '/zones',
  },
]

function Sidebar({...props}) {
  const {onUpdateAuthState} = React.useContext(AuthContext)

  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  function handleDrawerOpen() {
    setOpen(true)
  }

  function handleDrawerClose() {
    setOpen(false)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    onUpdateAuthState(false)
  }

  return (
    <Stack
      component="aside"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'lightClr.main',
        borderRadius: 'var(--sm-corner)',
      }}
      {...props}
    >
      <Box sx={{py: 1, px: 2}}>
        {open ? (
          <Grid
            container
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: 2,
            }}
            onClick={handleDrawerClose}
          >
            <IconButton sx={{p: 0}}>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
            <Typography>بستن منو</Typography>
          </Grid>
        ) : (
          <IconButton onClick={handleDrawerOpen} sx={{p: 0}} size="small">
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      <List>
        {menuListItems.map(({name, icon, href}) => (
          <ListItem key={name} disablePadding>
            <Link href={href} style={{width: '100%'}}>
              <ListItemButton>
                <ListItemIcon sx={{...(!open && {minWidth: 0})}}>
                  {icon}
                </ListItemIcon>
                {open && <ListItemText primary={name} sx={{m: 0}} />}
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <Box sx={{p: 1, mt: 'auto'}}>
        <Divider />

        <ListItemButton
          sx={{
            justifyContent: 'center',
            bgcolor: 'error.dark',
            color: 'error.contrastText',
            borderRadius: 'var(--sm-corner)',
            mt: 1,

            ...(!open && {px: 0}),
          }}
          onClick={handleLogout}
        >
          {open && <ListItemText primary="خروج" sx={{m: 0}} />}
          <ListItemIcon sx={{minWidth: 0, color: 'error.contrastText'}}>
            <Logout />
          </ListItemIcon>
        </ListItemButton>
      </Box>
    </Stack>
  )
}

export {Sidebar}
