import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

function Footer({...props}) {
  const year = new Date().toLocaleDateString('fa-IR', {year: 'numeric'})

  return (
    <Grid
      container
      component="footer"
      sx={{
        minHeight: 'var(--footer-height)',
        textAlign: 'center',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      {...props}
    >
      <Typography variant="caption">
        داشبورد کنترل نمایش تلویزیون ها نسخه 1.0 - {year}
      </Typography>
    </Grid>
  )
}

export {Footer}
