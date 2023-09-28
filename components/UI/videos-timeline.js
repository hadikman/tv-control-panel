import * as React from 'react'
import {DndContext} from '@dnd-kit/core'
import {restrictToHorizontalAxis} from '@dnd-kit/modifiers'
import {Draggable, Droppable} from 'components/UI'
import Image from 'next/image'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ClearIcon from '@mui/icons-material/Clear'
import {generateKeyCopy, milisecondsToTime} from 'util/helper-functions'
import {videos} from 'util/dummy-data'

export function VideosTimeline({sx, ...props}) {
  const [addedFiles, setAddedFiles] = React.useState([])
  const totalMilisecsRef = React.useRef(0)

  const addedVideosCount = addedFiles.length
  const isEmptyTimeline = addedVideosCount === 0

  const timeChunkInMilisec = 300000 // 5 minutes
  const occupiedCellCount =
    totalMilisecsRef.current !== 0
      ? totalMilisecsRef.current / timeChunkInMilisec
      : 0

  const timeCells = [
    ...Array.from({length: 13}, (_, i) => ({
      cellLength: milisecondsToTime(timeChunkInMilisec * i),
      occupiedCell: i < occupiedCellCount ? 100 : 0,
    })),
  ]

  function handleDragEnd(event) {
    const {active} = event
    const {id, name, duration} = active.data.current
    totalMilisecsRef.current += duration

    setAddedFiles(prevState => [
      ...prevState,
      {id: generateKeyCopy(id), name, duration},
    ])
  }

  function removeItem(id) {
    const getVideoObj = addedFiles.find(item => item.id === id)

    totalMilisecsRef.current -= getVideoObj.duration
    setAddedFiles(prevState => prevState.filter(item => item.id !== id))
  }

  return (
    <Stack sx={{gap: 5, ...sx}} {...props}>
      <DndContext id="dnd-context-files" onDragEnd={handleDragEnd}>
        <VideosPreviewGrid />
      </DndContext>

      <DndContext
        id="dnd-context-timeline"
        modifiers={[restrictToHorizontalAxis]}
      >
        <Stack>
          <Typography>
            مدت زمان پخش {milisecondsToTime(totalMilisecsRef.current)}
          </Typography>

          <Grid
            container
            columns={13}
            sx={{
              textAlign: 'center',
              bgcolor: 'darkClr.main',
              color: 'lightClr.main',
              pt: 1,
            }}
          >
            {timeCells.map(({occupiedCell}, idx) => (
              <Grid
                key={idx}
                item
                xs={1}
                sx={{
                  fontSize: '0.75rem',
                  borderTop: '1px solid',
                  borderColor: 'lightClr.main',
                  flexWrap: 'nowrap',
                }}
              >
                <Box sx={{position: 'relative'}}>
                  <Box
                    sx={{
                      width: '1px',
                      height: idx % 2 === 1 ? '8px' : '16px',
                      bgcolor: 'lightClr.main',
                      ml: 'auto',
                      mr: 'auto',
                    }}
                  ></Box>

                  <Box
                    sx={{
                      position: 'absolute',
                      top: '2px',
                      right: 0,
                      width: `${occupiedCell}%`,
                      height: '4px',
                      bgcolor: 'success.light',
                    }}
                  ></Box>
                </Box>
              </Grid>
            ))}

            {timeCells.map(({cellLength}, idx) => (
              <Grid key={idx} item xs={1} sx={{fontSize: '0.75rem'}}>
                {cellLength}
              </Grid>
            ))}
          </Grid>

          <Droppable
            id="droppable-area"
            sx={{
              alignItems: 'center',
              flexWrap: 'nowrap',
              gap: 1,
              bgcolor: '#ccc',
              py: 2,
              px: 1,
            }}
          >
            {isEmptyTimeline ? (
              <Typography key={generateKeyCopy('temp-element')} sx={{py: 1}}>
                فایل مورد نظر خود را با استفاده از{' '}
                <IconButton size="small">
                  <DragIndicatorIcon />
                </IconButton>{' '}
                در اینجا قرار دهید
              </Typography>
            ) : (
              addedFiles.map(({id, name}) => (
                <Grid
                  key={id}
                  item
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'accentClr.main',
                    borderRadius: 'var(--sm-corner)',
                    p: 1,
                  }}
                >
                  <Draggable id={id}>{name}</Draggable>
                  <IconButton onClick={() => removeItem(id)}>
                    <ClearIcon />
                  </IconButton>
                </Grid>
              ))
            )}
          </Droppable>
        </Stack>
      </DndContext>
    </Stack>
  )
}

function VideosPreviewGrid() {
  return (
    <Grid
      container
      sx={{
        '--card-height': '10rem',
        '--wrapper-imgs-height': 'calc(var(--card-height) * 0.86)',
        '--card-name-height':
          'calc(var(--card-height) - var(--wrapper-imgs-height))',
        minHeight: 'var(--card-height)',
      }}
    >
      {videos.map(({id, name, duration, thumbnails}) => (
        <Grid
          key={id}
          xs={4}
          item
          sx={{border: '1px solid', borderColor: 'lightClr.main'}}
        >
          <PreviewVideo thumbnails={thumbnails} />

          <Grid container sx={{alignItems: 'center', bgcolor: '#fefefe', p: 1}}>
            <Draggable id={id} data={{id, name, duration}}>
              <IconButton sx={{p: '2px', mr: 1}}>
                <DragIndicatorIcon />
              </IconButton>
            </Draggable>

            <Typography variant="body1" sx={{flexGrow: 1}}>
              {name}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}

function PreviewVideo({thumbnails}) {
  let intervalFunRef = React.useRef()
  const [imageIdx, setImageIdx] = React.useState(0)
  const screenshotCount = thumbnails.length

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
      <IconButton
        size="large"
        color={isPlaying ? 'error' : 'accentClr'}
        onClick={isPlaying ? handleStopButton : handlePlayButton}
      >
        {isPlaying ? <StopCircleIcon /> : <PlayCircleIcon />}
      </IconButton>
    </Box>
  )
}
