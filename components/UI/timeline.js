import * as React from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {restrictToHorizontalAxis} from '@dnd-kit/modifiers'
import Image from 'next/image'
import {SendButton} from 'components/UI'
import useClickOutsideElement from 'hook/useClickOutsideElement'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ClearIcon from '@mui/icons-material/Clear'
import SaveIcon from '@mui/icons-material/Save'
import AddAlarmIcon from '@mui/icons-material/AddAlarm'
import DoneIcon from '@mui/icons-material/Done'
import {milisecondsToTime, truncateWords} from 'util/helper-functions'
import {customHorizontalScrollbar} from 'util/scrollbar-group'

export function Timeline({
  id,
  filesArr,
  saveTimelineFn,
  isSending,
  isSent,
  ...props
}) {
  const [timelineFiles, setTimelineFiles] = React.useState([])
  const [totalDuration, setTotalDuration] = React.useState(0)
  const [activeGrabbedItem, setActiveGrabbedItem] = React.useState({id: 0})

  const addedFilesCount = timelineFiles.length

  const isEmptyTimeline = addedFilesCount === 0
  const isActiveGrabbedItem = activeGrabbedItem.id !== 0

  const timeChunkInMilisec = 300000 // 5 minutes
  const occupiedCellCount =
    totalDuration !== 0 ? totalDuration / timeChunkInMilisec : 0

  const durationTimeLength = [
    ...Array.from({length: 145}, (_, i) => ({
      cellLength: milisecondsToTime(timeChunkInMilisec * i),
      occupiedCell: i < occupiedCellCount ? 100 : 0,
    })),
  ]

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  React.useEffect(() => {
    const filesArrCount = filesArr.length
    const isFilesArr = filesArrCount > 0
    const isSingleFile = filesArrCount === 1

    if (isFilesArr) {
      if (isSingleFile) {
        setTimelineFiles(prevState => [...prevState, ...filesArr])
      } else {
        setTimelineFiles(prevState => filesArr)
      }
    }
  }, [filesArr])

  React.useEffect(() => {
    if (timelineFiles.length > 0) {
      const total = timelineFiles.reduce((acc, currentFile) => {
        return acc + currentFile.duration
      }, 0)

      setTotalDuration(prevState => total)
    }
  }, [timelineFiles])

  function handleDragStart(event) {
    const {active} = event

    const fileObj = timelineFiles.find(item => item.id === active.id)

    setActiveGrabbedItem(prevState => ({...prevState, ...fileObj}))
  }

  function handleDragEnd(event) {
    const {active, over} = event

    if (!over) {
      return
    }

    if (active.id !== over.id) {
      setTimelineFiles(items => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }

    setActiveGrabbedItem({id: 0})
  }

  function handleUpdateTimelineFiles(newUpdateFile) {
    const {id, duration} = newUpdateFile

    const updateFileObj = timelineFiles.find(file => file.id === id)

    updateFileObj.duration = duration

    setTotalDuration(prevState => prevState + duration)
    setTimelineFiles(prevState => [...timelineFiles])
  }

  function handleDeleteFile(id) {
    const fileObj = timelineFiles.find(item => item.id === id)

    const isConfirmed = confirm(
      `آیا فایل "${fileObj.filename}" از نوار زمان حذف شود؟`,
    )

    if (isConfirmed) {
      setTotalDuration(prevState => prevState - fileObj.duration)
      setTimelineFiles(prevState => prevState.filter(item => item.id !== id))
    }
  }

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToHorizontalAxis]}
    >
      <Box {...props}>
        <Typography>مدت زمان پخش {milisecondsToTime(totalDuration)}</Typography>

        <Box sx={{bgcolor: 'darkClr.main', my: 1}}>
          <Box
            sx={{
              '--cell-width': '55px',
              '--short-line': '8px',
              '--long-line': 'calc(var(--short-line) * 2)',
              '--bottom-gap': '2px',
              '--short-line-gap': 'calc(var(--short-line) + var(--bottom-gap))',
              display: 'grid',
              gap: 1,
              textAlign: 'center',
              color: 'lightClr.main',
              pt: 1,
              pb: 2,
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridAutoFlow: 'column',
                gridAutoColumns: 'var(--cell-width)',
                py: 1,
                overflowX: 'auto',
                ...customHorizontalScrollbar,
              }}
            >
              {durationTimeLength.map(({cellLength, occupiedCell}, idx) => (
                <Box key={idx}>
                  <Box
                    data-top-side-container
                    sx={{
                      borderTop: '1px solid',
                      borderColor: 'lightClr.main',
                      mb:
                        idx % 2 === 1
                          ? 'var(--short-line-gap)'
                          : 'var(--bottom-gap)',
                    }}
                  >
                    <Box sx={{position: 'relative'}}>
                      <Box
                        sx={{
                          width: '1px',
                          height:
                            idx % 2 === 1
                              ? 'var(--short-line)'
                              : 'var(--long-line)',
                          bgcolor: 'lightClr.main',
                          mx: 'auto',
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
                  </Box>

                  <Box data-duration sx={{fontSize: '0.75rem'}}>
                    {cellLength}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <SortableContext
            id="droppable-sortable-area"
            items={timelineFiles}
            strategy={horizontalListSortingStrategy}
          >
            <Box sx={{display: 'grid', p: 1}}>
              {isEmptyTimeline ? (
                <Typography sx={{py: 1, color: 'lightClr.main'}}>
                  فایل مورد نظر خود را با استفاده از{' '}
                  <IconButton size="small">
                    <DragIndicatorIcon sx={{color: 'lightClr.main'}} />
                  </IconButton>{' '}
                  در اینجا قرار دهید
                </Typography>
              ) : (
                <Box
                  sx={{
                    '--thumbnail-size': '70px',
                    '--header-frame-height': '24px',
                    '--edge-gap': '4px',
                    '--timeline-height': '11rem',
                    '--file-wrapper-height':
                      'calc(var(--timeline-height) - 1rem)',
                    height: 'var(--timeline-height)',
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gridAutoColumns:
                      'calc(var(--thumbnail-size) + (var(--edge-gap) * 2))',
                    gridAutoRows:
                      'calc(var(--thumbnail-size) + var(--header-frame-height) + var(--edge-gap))',
                    gap: 'var(--edge-gap)',
                    bgcolor: 'hsl(0 0% 25%)',
                    p: 1,
                    px: 3,
                    overflowX: 'auto',
                    ...customHorizontalScrollbar,
                  }}
                >
                  {timelineFiles.map(({id, filename, duration, thumbnail}) => (
                    <Box
                      key={id}
                      sx={{
                        height: 'var(--file-wrapper-height)',
                        display: 'grid',
                        position: 'relative',
                      }}
                    >
                      <FileCard
                        id={id}
                        filename={filename}
                        duration={duration}
                        thumbnail={thumbnail}
                        updateFileFn={handleUpdateTimelineFiles}
                        deleteFileFn={handleDeleteFile}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </SortableContext>
          <DragOverlay>
            {isActiveGrabbedItem ? (
              <Item
                filename={activeGrabbedItem.filename}
                thumbnail={activeGrabbedItem.thumbnail}
              />
            ) : null}
          </DragOverlay>
        </Box>

        <SendButton
          lableText="ذخیره"
          isSending={isSending}
          isSuccess={isSent}
          iconCmp={<SaveIcon />}
          onClick={() => saveTimelineFn(timelineFiles)}
        />
      </Box>
    </DndContext>
  )
}

function FileCard({
  id,
  filename,
  duration,
  thumbnail,
  updateFileFn,
  deleteFileFn,
}) {
  const [openTimePicker, setOpenTimePicker] = React.useState(false)
  const isTimePicker = openTimePicker

  const isVideo = filename.endsWith('.mp4')

  function handleUpdateFileDuration(newDuration) {
    updateFileFn({id, duration: newDuration})
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'var(--header-frame-height) var(--thumbnail-size)',
        alignSelf: 'end',
        bgcolor: 'lightClr.main',
        p: '0 var(--edge-gap) var(--edge-gap)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 0.25,
          bgcolor: 'lightClr.main',
        }}
      >
        <SortableItem id={id} filename={filename}>
          <IconButton
            size="small"
            sx={{p: 0, ':hover': {color: 'darkClr.main'}}}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
        </SortableItem>

        <IconButton
          size="small"
          sx={{p: 0, ':hover': {color: 'error.main'}}}
          onClick={() => deleteFileFn(id)}
        >
          <ClearIcon fontSize="small" />
        </IconButton>

        {isVideo ? null : isTimePicker ? (
          <TimePicker
            duration={duration}
            updateFn={handleUpdateFileDuration}
            closeFn={setOpenTimePicker}
          />
        ) : (
          <IconButton
            size="small"
            onClick={setOpenTimePicker}
            sx={{p: 0, ':hover': {color: 'info.main'}}}
          >
            <AddAlarmIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          height: '100%',
          bgcolor: 'lightClr.main',
          position: 'relative',
          overflow: 'hidden',
          ':hover': {
            '.info': {
              transform: 'translateY(100%)',
              visibility: 'hidden',
              opacity: 0,
            },
          },
        }}
      >
        <Image
          src={thumbnail}
          alt="عکس شاخص ویدئو"
          fill
          sizes='sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"'
          style={{objectFit: 'cover'}}
        />
        <Typography
          className="info"
          sx={{
            position: 'absolute',
            inset: '40% 0 0',
            fontSize: '0.75rem',
            lineHeight: 1.25,
            color: 'lightClr.main',
            bgcolor: 'hsl(0 0% 10% / 0.70)',
            p: '2px',
            transition: '0.2s ease-out, transform 0.3s',
          }}
        >
          {truncateWords(filename, 17)}
        </Typography>
      </Box>
    </Box>
  )
}

function TimePicker({duration, updateFn, closeFn}) {
  const [seconds, setSeconds] = React.useState('')
  const [minutes, setMinutes] = React.useState('')
  const {ref: clickOutsideElRef} = useClickOutsideElement(closeFn)

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

    const secondsToMilisecs = seconds * 1000 || 0
    const minutesToMilisecs = minutes * 60 * 1000 || 0
    const totalMilisec = secondsToMilisecs + minutesToMilisecs

    updateFn(totalMilisec)
    closeFn(false)
  }

  return (
    <Stack
      component="form"
      sx={{
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '160%',
        bgcolor: 'lightClr.main',
        border: '1px solid',
        borderColor: 'info.light',
        borderRadius: 'var(--sm-corner)',
        p: 1,
        boxShadow: '0 6px 12px 2px hsl(0 0% 0% / 0.2)',
        zIndex: 10,
        input: {
          '&::placeholder': {fontSize: '0.75em'},
        },
      }}
      onSubmit={handleOnSubmitTimePicker}
      ref={clickOutsideElRef}
    >
      <Grid
        sx={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.75rem',
          alignItems: 'center',
          gap: 0.5,
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

        <Box
          sx={{
            position: 'absolute',
            top: '111%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: -2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              bgcolor: 'lightClr.main',
              border: '1px solid',
              borderColor: 'info.light',
              borderRadius: 'var(--sm-corner)',
              p: '2px 6px',
            }}
          >
            {milisecondsToTime(duration)}
          </Typography>
        </Box>
      </Grid>
    </Stack>
  )
}

function SortableItem({id, filename, children}) {
  const {attributes, listeners, setNodeRef, transform, transition} =
    useSortable({id, filename})

  const itemBaseStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Box
      ref={setNodeRef}
      sx={{
        ...itemBaseStyle,
      }}
      {...attributes}
      {...listeners}
    >
      {children}
    </Box>
  )
}

const Item = React.forwardRef(({filename, thumbnail, ...props}, ref) => {
  return (
    <Box
      sx={{
        width: '75px',
        height: '75px',
        bgcolor: 'lightClr.main',
        borderRadius: 'var(--md-corner)',
        color: 'darkClr.main',
        border: '3px solid',
        borderColor: 'hsl(0 0% 55%)',
        boxShadow: '0 0 10px 4px hsl(0 0% 15% / 0.45)',
        filter: 'grayscale(1)',
        mt: 3,
        overflow: 'hidden',
        position: 'relative',
      }}
      {...props}
      ref={ref}
    >
      <Image
        src={thumbnail}
        alt="عکس شاخص ویدئو"
        fill
        sizes='sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"'
        style={{objectFit: 'cover'}}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: '50% 0 0',
          fontSize: '0.75rem',
          lineHeight: 1.25,
          color: 'lightClr.main',
          bgcolor: 'hsl(0 0% 10% / 0.50)',
          p: 1,
        }}
      >
        {truncateWords(filename, 17)}
      </Box>
    </Box>
  )
})

Item.displayName = 'DragOverlayItem'
