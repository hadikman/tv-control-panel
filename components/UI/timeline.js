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
import {restrictToHorizontalAxis} from '@dnd-kit/modifiers'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ClearIcon from '@mui/icons-material/Clear'
import SaveIcon from '@mui/icons-material/Save'
import {milisecondsToTime, truncateWords} from 'util/helper-functions'

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

function Timeline({
  id,
  playDuration,
  filesArr,
  removeFileFn,
  updateArrStateFn,
  saveTimelineFn,
  isSending,
  ...props
}) {
  const [activeGrabbedItem, setActiveGrabbedItem] = React.useState({id: 0})

  const addedVideosCount = filesArr.length
  const isEmptyTimeline = addedVideosCount === 0
  const isActiveGrabbedItem = activeGrabbedItem.id !== 0

  const timeChunkInMilisec = 300000 // 5 minutes
  const occupiedCellCount =
    playDuration !== 0 ? playDuration / timeChunkInMilisec : 0

  const timeCells = [
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

  function handleDragStart(event) {
    const {active} = event

    const getVideoObj = filesArr.find(item => item.id === active.id)

    setActiveGrabbedItem(prevState => ({...prevState, ...getVideoObj}))
  }

  function handleDragEnd(event) {
    const {active, over} = event

    if (active.id !== over.id) {
      updateArrStateFn(items => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }

    setActiveGrabbedItem({id: 0})
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
        <Typography>مدت زمان پخش {milisecondsToTime(playDuration)}</Typography>

        <Box sx={{my: 1}}>
          <Box
            sx={{
              '--cell-width': '55px',
              maxWidth: '85vw',
              display: 'grid',
              textAlign: 'center',
              bgcolor: 'darkClr.main',
              color: 'lightClr.main',
              py: 1,
              mx: 'auto',
              overflowX: 'auto',
            }}
          >
            <Box sx={{display: 'flex'}}>
              {timeCells.map(({occupiedCell}, idx) => (
                <Box
                  key={idx}
                  sx={{
                    minWidth: 'var(--cell-width)',
                    fontSize: '0.75rem',
                    borderTop: '1px solid',
                    borderColor: 'lightClr.main',
                  }}
                >
                  <Box sx={{position: 'relative'}}>
                    <Box
                      sx={{
                        width: '1px',
                        height: idx % 2 === 1 ? '8px' : '16px',
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
              ))}
            </Box>

            <Box sx={{display: 'flex'}}>
              {timeCells.map(({cellLength}, idx) => (
                <Box
                  key={idx}
                  sx={{minWidth: 'var(--cell-width)', fontSize: '0.75rem'}}
                >
                  {cellLength}
                </Box>
              ))}
            </Box>
          </Box>

          <SortableContext
            id="droppable-sortable-area"
            items={filesArr}
            strategy={horizontalListSortingStrategy}
          >
            <Box
              sx={{
                '--thumbnail-size': '70px',
                maxWidth: '85vw',
                display: 'flex',
                gap: '8px',
                bgcolor: 'hsl(0 0% 35%)',
                mx: 'auto',
                p: 1,
                overflowX: 'auto',
              }}
            >
              {isEmptyTimeline ? (
                <Typography sx={{py: 1, color: 'lightClr.main'}}>
                  فایل مورد نظر خود را با استفاده از{' '}
                  <IconButton size="small">
                    <DragIndicatorIcon sx={{color: 'lightClr.main'}} />
                  </IconButton>{' '}
                  در اینجا قرار دهید
                </Typography>
              ) : (
                filesArr.map(({id, filename, thumbnail}) => (
                  <Box
                    key={id}
                    sx={{
                      width: 'var(--thumbnail-size)',
                      height: 'var(--thumbnail-size)',
                      flexShrink: 0,
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
                      src={`/video-thumbnails/${thumbnail}.jpg`}
                      alt="عکس شاخص ویدئو"
                      fill
                      sizes='sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"'
                      style={{objectFit: 'cover'}}
                    />
                    <Typography
                      className="info"
                      sx={{
                        position: 'absolute',
                        inset: '50% 0 0',
                        fontSize: '0.75rem',
                        lineHeight: 1.25,
                        color: 'lightClr.main',
                        bgcolor: 'hsl(0 0% 10% / 0.25)',
                        p: '2px',
                        transition: '0.2s ease-out, transform 0.3s',
                      }}
                    >
                      {truncateWords(filename, 17)}
                    </Typography>

                    <IconButton
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        p: '4px',
                      }}
                      onClick={() => removeFileFn(id)}
                    >
                      <ClearIcon sx={{fontSize: '1.125rem'}} />
                    </IconButton>

                    <SortableItem id={id} filename={filename}>
                      <IconButton>
                        <DragIndicatorIcon sx={{color: 'darkClr.main'}} />
                      </IconButton>
                    </SortableItem>
                  </Box>
                ))
              )}
            </Box>
          </SortableContext>
          <DragOverlay>
            {isActiveGrabbedItem ? (
              <Item
                filename={activeGrabbedItem.filename}
                thumbnails={activeGrabbedItem.thumbnails}
              />
            ) : null}
          </DragOverlay>
        </Box>

        <Button
          variant="contained"
          endIcon={isSending ? <CircularProgress size={18} /> : <SaveIcon />}
          disabled={isSending ? true : false}
          color="success"
          onClick={saveTimelineFn}
        >
          ذخیره
        </Button>
      </Box>
    </DndContext>
  )
}

export {Timeline}

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

const Item = React.forwardRef(({filename, ...props}, ref) => {
  return (
    <Box
      sx={{
        width: '70px',
        height: '70px',
        bgcolor: 'lightClr.main',
        borderRadius: 'var(--md-corner)',
        color: 'darkClr.main',
        border: '2px solid',
        borderColor: 'hsl(0 0% 75%)',
        boxShadow: '0 0 10px 4px hsl(0 0% 15% / 0.45)',
        position: 'relative',
      }}
      {...props}
      ref={ref}
    >
      <Typography
        sx={{
          position: 'absolute',
          inset: '-6px',
          fontSize: '0.875rem',
          p: '12px',
        }}
      >
        {truncateWords(filename, 17)}
      </Typography>
    </Box>
  )
})

Item.displayName = 'DragOverlayItem'
