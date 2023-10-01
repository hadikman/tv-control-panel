import * as React from 'react'
import {DndContext} from '@dnd-kit/core'
import {restrictToHorizontalAxis} from '@dnd-kit/modifiers'
import {Droppable} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ClearIcon from '@mui/icons-material/Clear'
import SaveIcon from '@mui/icons-material/Save'
import {generateKeyCopy, milisecondsToTime} from 'util/helper-functions'

function Timeline({id, playDuration, filesArr, removeFileFn}) {
  const [isSending, setIsSending] = React.useState(false)

  const addedVideosCount = filesArr.length
  const isEmptyTimeline = addedVideosCount === 0

  const timeChunkInMilisec = 300000 // 5 minutes
  const occupiedCellCount =
    playDuration !== 0 ? playDuration / timeChunkInMilisec : 0

  const timeCells = [
    ...Array.from({length: 13}, (_, i) => ({
      cellLength: milisecondsToTime(timeChunkInMilisec * i),
      occupiedCell: i < occupiedCellCount ? 100 : 0,
    })),
  ]

  function handleSaveTimelineState() {
    setIsSending(true)

    // TODO send a POST request to the API
    console.log(filesArr)

    setTimeout(() => {
      setIsSending(false)
    }, 1500)
  }

  return (
    <DndContext id={id} modifiers={[restrictToHorizontalAxis]}>
      <Box>
        <Typography>مدت زمان پخش {milisecondsToTime(playDuration)}</Typography>

        <Box my={1}>
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
              p: 2,
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
              filesArr.map(({id, name}) => (
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
                  <Button
                    variant="contained"
                    endIcon={<ClearIcon onClick={() => removeFileFn(id)} />}
                    color="inherit"
                    sx={{textTransform: 'none', fontSize: '0.75rem'}}
                  >
                    {name}
                  </Button>
                </Grid>
              ))
            )}
          </Droppable>
        </Box>

        <Button
          variant="contained"
          endIcon={isSending ? <CircularProgress size={18} /> : <SaveIcon />}
          disabled={isSending ? true : false}
          onClick={handleSaveTimelineState}
          color="accentClr"
        >
          ذخیره
        </Button>
      </Box>
    </DndContext>
  )
}

export {Timeline}
