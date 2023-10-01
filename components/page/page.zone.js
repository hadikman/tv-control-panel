import {DropZone, VideosTimeline} from 'components/UI'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

function Zone() {
  return (
    <Box>
      <Box sx={{mb: 2}}>
        <DropZone />
      </Box>

      <Divider />

      <Box sx={{mt: 2}}>
        <VideosTimeline />
      </Box>
    </Box>
  )
}

export default Zone
