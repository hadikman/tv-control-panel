import * as React from 'react'
import useMediaFilesData from 'hook/useMediaFilesData'
import Image from 'next/image'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import ImageIcon from '@mui/icons-material/Image'
import ClearIcon from '@mui/icons-material/Clear'
import {milisecondsToTime} from 'util/helper-functions'

export function PreviewMediaFiles() {
  const {data, isSuccess} = useMediaFilesData()

  let files = []

  if (isSuccess) {
    files = data.data.files
  }

  function handleDeleteMedia(id) {
    // TODO send a POST request to the API

    console.log({id})
  }

  return (
    <Grid
      container
      spacing={1}
      sx={{
        '--card-height': '10rem',
        '--wrapper-imgs-height': 'calc(var(--card-height) * 0.86)',
        '--card-name-height':
          'calc(var(--card-height) - var(--wrapper-imgs-height))',
        minHeight: 'var(--card-height)',
      }}
    >
      {isSuccess &&
        files.map(({id, filename, duration, thumbnails}) => (
          <Grid key={id} item xs={3} md={2} xl={1}>
            <Box sx={{border: '1px solid', borderColor: 'lightClr.main'}}>
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
                  bgcolor: '#fefefe',
                  p: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    flexGrow: 1,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {filename}
                </Typography>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteMedia(id)}
                >
                  <ClearIcon />
                </IconButton>
              </Grid>
            </Box>
          </Grid>
        ))}
    </Grid>
  )
}

function FilePreview({filename, duration, thumbnails}) {
  let intervalFunRef = React.useRef()
  const [imageIdx, setImageIdx] = React.useState(0)

  const screenshotsCount = thumbnails.length

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
    if (imageIdx === screenshotsCount) {
      clearInterval(intervalFunRef.current)
      intervalFunRef.current = null
      setImageIdx(0)
    }
  }, [imageIdx, screenshotsCount])

  return (
    <Box sx={{height: 'var(--wrapper-imgs-height)', position: 'relative'}}>
      <Image
        src={`/video-thumbnails/${thumbnails[imageIdx]}.jpg`}
        alt="فریم ویدئو"
        fill
        sizes='sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"'
        style={{objectFit: 'cover'}}
      />
      {isVideo ? (
        <>
          {isPlaying ? (
            <IconButton size="small" color="error" onClick={handleStopButton}>
              <StopCircleIcon />
            </IconButton>
          ) : (
            <IconButton
              size="small"
              color="secondary.main"
              onClick={handlePlayButton}
            >
              <PlayCircleIcon />
            </IconButton>
          )}
        </>
      ) : (
        <IconButton size="small" color="secondary.main">
          <ImageIcon />
        </IconButton>
      )}

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
