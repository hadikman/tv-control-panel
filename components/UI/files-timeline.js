import * as React from 'react'
import {useRouter} from 'next/router'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {DndContext} from '@dnd-kit/core'
import {FilesGrid, Timeline} from 'components/UI'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import {generateKeyCopy} from 'util/helper-functions'
import {fetchAndPostData} from 'util/helper-functions'
import {GET_ZONE_TIMElINE_API, SAVE_ZONE_TIMELINE_API} from 'util/api-url'

const GET_ZONE_TIMELINE_URL =
  process.env.NEXT_PUBLIC_DOMAIN + GET_ZONE_TIMElINE_API
const SAVE_ZONE_TIMELINE_URL =
  process.env.NEXT_PUBLIC_DOMAIN + SAVE_ZONE_TIMELINE_API

export function FilesAndTimeline({sx, ...props}) {
  const router = useRouter()
  const {q} = router.query
  const queryClient = useQueryClient()
  const {data, isSuccess} = useQuery({
    queryKey: ['timeline-data', q],
    queryFn: () =>
      fetchAndPostData(GET_ZONE_TIMELINE_URL, {
        body: JSON.stringify({zoneID: +q}),
      }),
    refetchOnWindowFocus: false,
  })
  const {mutate, isLoading: isSending} = useMutation({
    mutationFn: timelineNewData => {
      return fetchAndPostData(SAVE_ZONE_TIMELINE_URL, {
        body: JSON.stringify(timelineNewData),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['timeline-data', q]})
    },
  })
  const [addedFiles, setAddedFiles] = React.useState([])
  const totalMilisecsRef = React.useRef(0)

  let timelineData = React.useMemo(() => [], [])

  if (isSuccess) {
    timelineData = data.data
  }

  React.useEffect(() => {
    if (isSuccess) {
      totalMilisecsRef.current = 0
      timelineData.forEach(item => (totalMilisecsRef.current += +item.duration))

      setAddedFiles(prevState => [
        ...timelineData.map(item => ({
          ...item,
          id: generateKeyCopy(item.id),
          duration: +item.duration,
        })),
      ])
    }
  }, [isSuccess, timelineData])

  function handleDragEnd(event) {
    const {active} = event
    const {id, filename, duration, thumbnails} = active.data.current

    totalMilisecsRef.current += +duration

    setAddedFiles(prevState => [
      ...prevState,
      {
        id: generateKeyCopy(id),
        filename,
        duration: +duration,
        thumbnail: thumbnails[0],
      },
    ])
  }

  function handleRemoveFile(id) {
    const getVideoObj = addedFiles.find(item => item.id === id)

    totalMilisecsRef.current -= getVideoObj.duration
    setAddedFiles(prevState => prevState.filter(item => item.id !== id))
  }

  function handleOnSaveTimelineState() {
    const clonedAddedFiles = [...addedFiles]
    const manipulatedTimelineObj = clonedAddedFiles.map(
      ({filename, duration, thumbnail}, idx) => ({
        id: idx,
        filename,
        duration,
        thumbnail,
      }),
    )
    const timelineData = {zoneID: +q, timeline: manipulatedTimelineObj}

    // TODO send a POST request to the API
    mutate(timelineData)
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
          playDuration={totalMilisecsRef.current}
          removeFileFn={handleRemoveFile}
          updateArrStateFn={setAddedFiles}
          saveTimelineFn={handleOnSaveTimelineState}
          isSending={isSending}
        />
      </Box>
    </Stack>
  )
}
