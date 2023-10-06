import {FilesAndTimeline} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

function Zone() {
  return (
    <Box>
      <Box sx={{mb: 2}}>
        <Grid container>
          <Grid item xs={6}>
            کل استند های متصل: 0
          </Grid>
          <Grid item xs={6}>
            کل انلاین ها: 0
          </Grid>
        </Grid>
      </Box>

      <Divider />

      <Box sx={{mt: 2}}>
        <FilesAndTimeline />
      </Box>
    </Box>
  )
}

export default Zone
