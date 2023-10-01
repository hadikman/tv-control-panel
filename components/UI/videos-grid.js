import * as React from 'react'
import {Draggable, Form} from 'components/UI'
import Image from 'next/image'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import Button from '@mui/material/Button'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import AddAlarmIcon from '@mui/icons-material/AddAlarm'
import DoneIcon from '@mui/icons-material/Done'
import {files} from 'util/dummy-data'

export function VideosGrid() {
  return (
    <Grid
      container
      sx={{
        '--card-height': '5rem',
        '--wrapper-imgs-height': 'calc(var(--card-height) * 0.86)',
        '--card-name-height':
          'calc(var(--card-height) - var(--wrapper-imgs-height))',
        minHeight: 'var(--card-height)',
        gap: '4px',
      }}
    >
      {files.map(({id, name, duration, thumbnails}) => (
        <Grid
          key={id}
          item
          sx={{
            minWidth: '5rem',
            maxWidth: '5rem',
            border: '1px solid',
            borderColor: 'lightClr.main',
          }}
        >
          <FilePreview filename={name} thumbnails={thumbnails} />

          <Grid
            container
            sx={{
              flexWrap: 'nowrap',
              alignItems: 'center',
              bgcolor: '#fefefe',
              py: 1,
              px: '4px',
            }}
          >
            <Draggable id={id} data={{id, name, duration}}>
              <IconButton sx={{p: 0}}>
                <DragIndicatorIcon sx={{fontSize: 20}} />
              </IconButton>
            </Draggable>

            <Typography
              variant="caption"
              sx={{
                flexGrow: 1,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {name}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}

function FilePreview({filename, thumbnails}) {
  let intervalFunRef = React.useRef()
  const [imageIdx, setImageIdx] = React.useState(0)
  const [isTimePicker, setIsTimePicker] = React.useState(false)
  const [seconds, setSeconds] = React.useState('')
  const [minutes, setMinutes] = React.useState('')
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

  function handleOnChangeSecond(event) {
    const number = event.target.value

    if (/^\d{0,2}$/.test(number)) {
      if (+number <= 60) {
        setSeconds(number)
      }

      if (isNaN(+number)) {
        setSeconds('')
      }
    }
  }

  function handleOnChangeMinute(event) {
    const number = event.target.value

    if (/^\d{0,2}$/.test(number)) {
      if (+number <= 60) {
        setMinutes(number)
      }

      if (isNaN(+number)) {
        setMinutes('')
      }
    }
  }

  function handleOnSubmitTimePicker(event) {
    event.preventDefault()

    const milisecsFromSeconds = seconds * 1000 || 0
    const milisecsFromMinutes = minutes * 60 * 1000 || 0
    const totalMilisec = milisecsFromSeconds + milisecsFromMinutes

    // TODO send a POST request to the API
    console.log(totalMilisec)

    setIsTimePicker(false)
  }

  React.useEffect(() => {
    if (imageIdx === screenshotCount) {
      clearInterval(intervalFunRef.current)
      intervalFunRef.current = null
      setImageIdx(0)
    }
  }, [imageIdx, screenshotCount])

  return (
    <Box
      sx={{
        height: 'var(--wrapper-imgs-height)',
        position: 'relative',
      }}
    >
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
      ) : isTimePicker ? (
        <Form
          sx={{
            position: 'absolute',
            left: '50%',
            bottom: '105%',
            transform: 'translateX(-50%)',
            width: '180%',
            bgcolor: 'lightClr.main',
            border: '1px solid',
            borderColor: 'info.light',
            borderRadius: 'var(--sm-corner)',
            p: 1,
            input: {
              '&::placeholder': {fontSize: '0.75em'},
            },
          }}
          onSubmit={handleOnSubmitTimePicker}
        >
          <Grid
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                borderRadius: 'var(--sm-corner)',
                p: '4px',
                ':hover': {
                  bgcolor: 'hsl(0 0% 90%)',
                },
              }}
            >
              <InputBase
                id="second"
                type="text"
                autoFocus
                value={seconds}
                placeholder="ثانیه"
                inputProps={{maxLength: 2}}
                // sx={{width: '1rem'}}
                onChange={handleOnChangeSecond}
              />

              {':'}

              <InputBase
                id="minute"
                type="text"
                value={minutes}
                placeholder="دقیقه"
                inputProps={{maxLength: 2}}
                onChange={handleOnChangeMinute}
              />
            </Box>

            <Button type="submit" sx={{minWidth: 'unset', fontSize: '6px'}}>
              <DoneIcon />
            </Button>
          </Grid>
        </Form>
      ) : (
        <IconButton
          size="small"
          color="secondary.main"
          onClick={setIsTimePicker}
        >
          <AddAlarmIcon />
        </IconButton>
      )}
    </Box>
  )
}
