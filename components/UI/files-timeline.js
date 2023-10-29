import * as React from 'react'
import {useRouter} from 'next/router'
import useQueryData from 'hook/useQueryData'
import useMutateData from 'hook/useMutateData'
import {GET_ZONE_TIMELINE_API, SAVE_ZONE_TIMELINE_API} from 'util/api-url'
import {DndContext} from '@dnd-kit/core'
import FilesGrid from 'components/UI/files-grid'
import Timeline from 'components/UI/timeline'
import Notification from 'components/UI/notification'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import {generateKeyCopy} from 'util/helper-functions'

export default function FilesAndTimeline({sx, ...props}) {
  const router = useRouter()
  const {q} = router.query
  const isQueryParam = q !== undefined
  const {data, isSuccess} = useQueryData({
    queryKey: ['timeline-data', q],
    url: GET_ZONE_TIMELINE_API,
    body: {zoneID: +q},
    refetchOnWindowFocus: false,
    enabled: isQueryParam,
  })
  const {
    mutate: mutateToSaveTimeline,
    isLoading: isSending,
    isSuccess: isAddedSuccessfully,
  } = useMutateData({
    url: SAVE_ZONE_TIMELINE_API,
    queryKey: ['timeline-data', q],
  })
  const [addedFiles, setAddedFiles] = React.useState([])
  const [status, setStatus] = React.useState('')

  const isAddedZone = status === 'added'

  const statusMsg = isAddedZone ? 'نوار زمان با موفقیت ذخیره گردید' : ''

  React.useEffect(() => {
    if (isSuccess) {
      if (data.success) {
        // eslint-disable-next-line no-unused-vars
        setAddedFiles(prevState => [
          ...data.data.map(item => ({
            ...item,
            id: generateKeyCopy(item.id),
            duration: +item.duration,
          })),
        ])
      }
    }

    if (isAddedSuccessfully) {
      setStatus('added')
    }
  }, [isSuccess, data, isAddedSuccessfully])

  function handleDragEnd(event) {
    const {active} = event
    const {id, filename, duration, thumbnails} = active.data.current

    // eslint-disable-next-line no-unused-vars
    setAddedFiles(prevState => [
      {
        id: generateKeyCopy(id),
        filename,
        duration: +duration,
        thumbnail: thumbnails[0],
      },
    ])
  }

  function handleOnSaveTimelineState(timelineFiles) {
    const manipulatedTimelineObj = timelineFiles.map(
      ({filename, duration, thumbnail}, idx) => ({
        id: idx,
        filename,
        duration,
        thumbnail,
      }),
    )
    const newTimelineData = {zoneID: +q, timeline: manipulatedTimelineObj}

    mutateToSaveTimeline(newTimelineData)
  }

  return (
    <Stack sx={{gap: 2, ...sx}} {...props}>
      <DndContext id="dnd-context-files" onDragEnd={handleDragEnd}>
        <FilesGrid />
      </DndContext>

      <Divider sx={{width: '85%', mx: 'auto'}}>
        <Chip label="نوار مدت زمان پخش" />
      </Divider>

      <Box>
        <Timeline
          id="dnd-context-timeline"
          filesArr={addedFiles}
          saveTimelineFn={handleOnSaveTimelineState}
          isSending={isSending}
          isSent={isAddedSuccessfully}
        />
      </Box>

      <Notification
        open={isAddedZone}
        onClose={setStatus}
        isSuccess={isAddedZone}
        message={statusMsg}
        autoHideDuration={3000}
      />
    </Stack>
  )
}
