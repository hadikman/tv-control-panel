import * as React from 'react'
import {DndContext} from '@dnd-kit/core'
import {VideosGrid, Timeline} from 'components/UI'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import {generateKeyCopy} from 'util/helper-functions'

export function VideosTimeline({sx, ...props}) {
  const [addedFiles, setAddedFiles] = React.useState([])
  const totalMilisecsRef = React.useRef(0)

  function handleDragEnd(event) {
    const {active} = event
    const {id, name, duration} = active.data.current

    totalMilisecsRef.current += duration

    setAddedFiles(prevState => [
      ...prevState,
      {id: generateKeyCopy(id), name, duration},
    ])
  }

  function handleRemoveFile(id) {
    const getVideoObj = addedFiles.find(item => item.id === id)

    totalMilisecsRef.current -= getVideoObj.duration
    setAddedFiles(prevState => prevState.filter(item => item.id !== id))
  }

  return (
    <Stack sx={{gap: 2, ...sx}} {...props}>
      <DndContext id="dnd-context-files" onDragEnd={handleDragEnd}>
        <VideosGrid />
      </DndContext>

      <Divider>
        <Chip label="نوار مدت زمان پخش" />
      </Divider>

      <Box>
        <Timeline
          id="dnd-context-timeline"
          filesArr={addedFiles}
          playDuration={totalMilisecsRef.current}
          removeFileFn={handleRemoveFile}
        />
      </Box>
    </Stack>
  )
}
