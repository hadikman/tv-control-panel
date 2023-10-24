import * as React from 'react'
import {useRouter} from 'next/router'
import axiosClient from 'util/axios-http'
import {GET_ZONE_TIMELINE_API, SAVE_ZONE_TIMELINE_API} from 'util/api-url'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {DndContext} from '@dnd-kit/core'
import {FilesGrid, Timeline, Notification} from 'components/UI'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import {generateKeyCopy} from 'util/helper-functions'

export function FilesAndTimeline({sx, ...props}) {
  const router = useRouter()
  const {q} = router.query
  const queryClient = useQueryClient()
  const {data, isSuccess} = useQuery({
    queryKey: ['timeline-data', q],
    queryFn: () =>
      axiosClient
        .post(GET_ZONE_TIMELINE_API, {zoneID: +q})
        .then(res => res.data),
    refetchOnWindowFocus: false,
  })
  const {
    mutate: mutateToSaveTimeline,
    isLoading: isSending,
    isSuccess: isAddedSuccessfully,
  } = useMutation({
    mutationFn: timelineNewData =>
      axiosClient
        .post(SAVE_ZONE_TIMELINE_API, timelineNewData)
        .then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['timeline-data', q]})
    },
  })
  const [addedFiles, setAddedFiles] = React.useState([])
  const [status, setStatus] = React.useState('')

  let timelineData = React.useMemo(() => [], [])

  const isAddedZone = status === 'added'

  const statusMsg = isAddedZone ? 'نوار زمان با موفقیت ذخیره گردید' : ''

  if (isSuccess) {
    if (data.success) {
      timelineData = data.data
    }
  }

  React.useEffect(() => {
    if (isSuccess) {
      if (data.success) {
        // eslint-disable-next-line no-unused-vars
        setAddedFiles(prevState => [
          ...timelineData.map(item => ({
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
  }, [isSuccess, data, timelineData, isAddedSuccessfully])

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
