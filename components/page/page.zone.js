import {DropZone, VideosTimeline} from 'components/UI'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'

function Zone() {
  return (
    <Box>
      <Container disableGutters sx={{mb: 2}}>
        <DropZone />
      </Container>

      <Divider />

      <VideosTimeline sx={{mt: 2}} />
    </Box>
  )
}

export default Zone
