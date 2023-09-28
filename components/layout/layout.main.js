import {Content, Sidebar} from './index'
import Grid from '@mui/material/Grid'

function Main({children, ...props}) {
  return (
    <Grid
      component="main"
      sx={{
        minHeight:
          'calc(100vh - (var(--header-height) + var(--footer-height)))',
        display: 'grid',
        gridTemplateColumns: 'max-content 1fr',
        gap: 1,
        p: 1,
      }}
      {...props}
    >
      <Sidebar />
      <Content>{children}</Content>
    </Grid>
  )
}

export {Main}
