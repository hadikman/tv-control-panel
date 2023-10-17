import * as React from 'react'
import useMediaFilesData from 'hook/useMediaFilesData'
import {FileCard} from 'components/UI'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import ClearIcon from '@mui/icons-material/Clear'
import {generateListOfIndex} from 'util/helper-functions'
import {customVerticalScrollbar} from 'util/scrollbar-group'

export function PreviewMediaFiles() {
  const {data, isLoading, isSuccess} = useMediaFilesData()

  let filesData = []

  const generatedListOfIndex = generateListOfIndex(3)

  if (isSuccess) {
    if (data.data.success) {
      filesData = data.data.data.files
    }
  }

  function handleDeleteMedia(id) {
    // TODO send a POST request to the API

    console.log({id})
  }

  return (
    <Grid
      container
      sx={{
        '--card-size': '6rem',
        '--gap': '6px',
        minHeight: 'var(--card-size)',
        maxHeight: '21rem',
        gap: 'var(--gap)',
        overflowY: 'auto',
        ...customVerticalScrollbar,
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
              <Typography
                variant="caption"
                sx={{
                  flexGrow: 1,
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  pl: 0.5,
                }}
              >
                {filename}
              </Typography>

              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteMedia(id)}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </FileCard>
          ))
        : null}
    </Grid>
  )
}
