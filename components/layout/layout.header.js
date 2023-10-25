import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function Header({...props}) {
  return (
    <Box sx={{bgcolor: 'primary.main'}}>
      <Grid
        container
        component="header"
        sx={{
          width: '100%',
          maxWidth: 'var(--container-width)',
          minHeight: 'var(--header-height)',
          letterSpacing: '1px',
          alignItems: 'center',
          color: 'primary.contrastText',
          px: 2,
          mx: 'auto',
        }}
        {...props}
      >
        <Typography variant="h5" sx={{px: 1}}>
          کنترل پنل
        </Typography>
      </Grid>
    </Box>
  )
}

export default Header
