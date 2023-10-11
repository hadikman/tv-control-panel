import * as React from 'react'
import Image from 'next/image'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import {milisecondsToTime} from 'util/helper-functions'

export function FileCard({filename, duration, thumbnails, sx, children}) {
  return (
    <Grid
      item
      xs={1}
      sx={{
        '--card-width': 'calc(var(--card-size) - var(--gap))',
        '--card-height': 'var(--card-size)',
        '--wrapper-imgs-height': 'calc(var(--card-height) * 0.86)',
        minWidth: 'var(--card-width)',
        ...sx,
      }}
    >
      <Box>
        <FilePreview
          filename={filename}
          duration={duration}
          thumbnails={thumbnails}
        />

        <Grid
          container
          sx={{
            flexWrap: 'nowrap',
            alignItems: 'center',
            bgcolor: 'hsl(0 0% 98%)',
            py: 1,
            px: '4px',
          }}
        >
          {children}
        </Grid>
      </Box>
    </Grid>
  )
}

function FilePreview({filename, duration, thumbnails}) {
  let intervalFunRef = React.useRef()
  const [imageIdx, setImageIdx] = React.useState(0)

  const screenshotCount = thumbnails.length

  const isVideo = filename.endsWith('.mp4')
  const isPlaying = imageIdx !== 0

  function intervalForPlayScreenshots() {
    setImageIdx(prevIdx => prevIdx + 1)
  }

  function handlePlayButton() {
    intervalFunRef.current = setInterval(intervalForPlayScreenshots, 1000)
  }

  function handleStopButton() {
    clearInterval(intervalFunRef.current)
    intervalFunRef = null
    setImageIdx(0)
  }

  React.useEffect(() => {
    if (imageIdx === screenshotCount) {
      clearInterval(intervalFunRef.current)
      intervalFunRef.current = null
      setImageIdx(0)
    }
  }, [imageIdx, screenshotCount])

  return (
    <Box sx={{height: 'var(--wrapper-imgs-height)', position: 'relative'}}>
      <Image
        src={imageIdx < screenshotCount ? thumbnails[imageIdx] : thumbnails[0]}
        alt="فریم ویدئو"
        fill
        sizes='sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"'
        style={{objectFit: 'cover'}}
      />
      {isVideo ? (
        isPlaying ? (
          <IconButton
            size="small"
            sx={{color: 'lightClr.main'}}
            onClick={handleStopButton}
          >
            <StopCircleIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            size="small"
            sx={{color: 'lightClr.main'}}
            onClick={handlePlayButton}
          >
            <PlayCircleIcon fontSize="small" />
          </IconButton>
        )
      ) : null}

      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          left: '5%',
          bottom: '5%',
          bgcolor: 'lightClr.main',
          border: 'thin solid',
          borderColor: 'hsl(0 0% 50%)',
          borderRadius: 'var(--sm-corner)',
          p: '2px 6px',
        }}
      >
        {milisecondsToTime(duration)}
      </Typography>
    </Box>
  )
}
