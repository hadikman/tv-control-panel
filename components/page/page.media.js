import * as React from 'react'
import {DropZone, PreviewMediaFiles} from 'components/UI'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

export default function Media() {
  return (
    <Box>
      <Box sx={{mb: 2}}>
        <DropZone />
      </Box>

      <Divider />

      <Box
        sx={{
          bgcolor: 'hsl(0 0% 88%)',
          borderRadius: 'var(--sm-corner)',
          p: 2,
          my: 2,
        }}
      >
        <PreviewMediaFiles />
      </Box>
    </Box>
  )
}
