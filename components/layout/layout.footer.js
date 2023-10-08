import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function Footer({...props}) {
  const persianDate = new Date().toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  })

  return (
    <Box sx={{bgcolor: 'primary.main'}}>
      <Grid
        container
        component="footer"
        sx={{
          width: '100%',
          maxWidth: 'var(--container-width)',
          minHeight: 'var(--footer-height)',
          textAlign: 'center',
          color: 'primary.contrastText',
          justifyContent: 'center',
          alignItems: 'center',
          mx: 'auto',
        }}
        {...props}
      >
        <Typography variant="caption">
          داشبورد کنترل نمایش تلویزیون ها نسخه 1.0 - {persianDate}
        </Typography>
      </Grid>
    </Box>
  )
}

export {Footer}
