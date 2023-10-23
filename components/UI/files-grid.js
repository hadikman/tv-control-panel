import * as React from 'react'
import useMediaFilesData from 'hook/useMediaFilesData'
import {Draggable, FileCard} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
import Skeleton from '@mui/material/Skeleton'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import {generateListOfIndex} from 'util/helper-functions'

export function FilesGrid() {
  const {data, isLoading, isSuccess} = useMediaFilesData()

  let filesData = []

  const generatedListOfIndex = generateListOfIndex(12)

  if (isSuccess) {
    if (data.data.success) {
      filesData = data.data.data.files
    }
  }

  return (
    <Box>
      <Grid
        container
        sx={{
          '--card-size': '5rem',
          '--gap': '6px',
          minHeight: 'calc(var(--card-size) * 2)',
          gap: 'var(--gap)',
          bgcolor: 'hsl(0 0% 90%)',
          border: '3px solid',
          borderColor: 'greyClr.main',
          borderRadius: 'var(--sm-corner)',
          p: 1,
        }}
      >
        {isLoading
          ? generatedListOfIndex.map(item => (
              <Grid key={item} item>
                <Skeleton
                  variant="rounded"
                  width="var(--card-size)"
                  height="var(--card-size)"
                />
              </Grid>
            ))
          : isSuccess
          ? filesData.map(({id, filename, duration, thumbnails}) => (
              <FileCard
                key={id}
                filename={filename}
                duration={duration}
                thumbnails={thumbnails}
              >
                <Draggable id={id} data={{id, filename, duration, thumbnails}}>
                  <IconButton sx={{p: 0}}>
                    <DragIndicatorIcon sx={{fontSize: 20}} />
                  </IconButton>
                </Draggable>

                <Tooltip TransitionComponent={Zoom} title={filename} arrow>
                  <Typography
                    variant="caption"
                    sx={{
                      flexGrow: 1,
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {filename}
                  </Typography>
                </Tooltip>
              </FileCard>
            ))
          : null}
      </Grid>
    </Box>
  )
}
