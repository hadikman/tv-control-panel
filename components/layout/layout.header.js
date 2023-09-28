import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

function Header({...props}) {
  return (
    <Grid
      container
      component="header"
      sx={{
        minHeight: 'var(--header-height)',
        letterSpacing: '1px',
        alignItems: 'center',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        px: 2,
      }}
      {...props}
    >
      <Typography variant="h5" sx={{px: 1}}>
        کنترل پنل
      </Typography>
    </Grid>
  )
}

export {Header}
