import * as React from 'react'
import useMediaFilesData from 'hook/useMediaFilesData'
import {FileCard} from 'components/UI'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ClearIcon from '@mui/icons-material/Clear'

export function PreviewMediaFiles() {
  const {data, isSuccess} = useMediaFilesData()

  let files = []

  if (isSuccess) {
    if (data.success) {
      files = data.data.files
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
        gap: 'var(--gap)',
      }}
    >
      {isSuccess &&
        files.map(({id, filename, duration, thumbnails}) => (
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
        ))}
    </Grid>
  )
}
