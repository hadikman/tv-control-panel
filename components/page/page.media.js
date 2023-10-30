import * as React from 'react'
import DropZone from 'components/UI/dropzone'
import PreviewMediaFiles from 'components/UI/preview-media-files'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

export default function Media() {
  return (
    <Box>
      <Box sx={{mb: 2}}>
        <DropZone />
      </Box>

      <Divider />

      <Box sx={{mt: 2}}>
        <PreviewMediaFiles />
      </Box>
    </Box>
  )
}
