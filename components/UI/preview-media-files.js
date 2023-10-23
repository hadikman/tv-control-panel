import * as React from 'react'
import axiosClient from 'util/axios-http'
import {DELETE_FILE_API} from 'util/api-url'
import useMediaFilesData from 'hook/useMediaFilesData'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {FileCard, Notification} from 'components/UI'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import ClearIcon from '@mui/icons-material/Clear'
import {generateListOfIndex} from 'util/helper-functions'
import {customVerticalScrollbar} from 'util/scrollbar-group'

export function PreviewMediaFiles() {
  const queryClient = useQueryClient()
  const {data, isLoading, isSuccess} = useMediaFilesData()
  const {
    data: deleteFileResponse,
    mutate: mutateToDeleteFile,
    isSuccess: isDeletedSuccessfully,
  } = useMutation({
    mutationFn: file => axiosClient.post(DELETE_FILE_API, file),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['media-files-data']})
    },
  })
  const [status, setStatus] = React.useState('')

  let filesData = []

  const isDeletedFile = status === 'deleted'
  const isUsedFile = status === 'used'

  const statusMsg = isDeletedFile
    ? 'فایل با موفقیت حذف گردید'
    : isUsedFile
    ? 'فایل در استند استفاده شده است، حذف فایل غیرمجاز است'
    : ''

  const generatedListOfIndex = generateListOfIndex(3)

  if (isSuccess) {
    if (data.data.success) {
      filesData = data.data.data.files
    }
  }

  React.useEffect(() => {
    if (isDeletedSuccessfully) {
      if (deleteFileResponse.data.success) {
        setStatus('deleted')
      } else {
        setStatus('used')
      }
    }
  }, [isDeletedSuccessfully, deleteFileResponse])

  function handleDeleteFile(id, filename) {
    const isConfirmed = confirm(`آیا فایل "${filename}" حذف شود؟`)

    if (isConfirmed) {
      mutateToDeleteFile({id, filename})
    }
  }

  return (
    <Grid
      container
      sx={{
        '--card-size': '6rem',
        '--gap': '6px',
        minHeight: 'var(--card-size)',
        maxHeight: '21rem',
        gap: 'var(--gap)',
        overflowY: 'auto',
        ...customVerticalScrollbar,
      }}
    >
      {isLoading
        ? generatedListOfIndex.map(item => (
            <Grid key={item} item>
              <Skeleton
                variant="rounded"
                width="var(--card-size)"
                height="var(--card-size)"
              />
            </Grid>
          ))
        : isSuccess
        ? filesData.map(({id, filename, duration, thumbnails}) => (
            <FileCard
              key={id}
              filename={filename}
              duration={duration}
              thumbnails={thumbnails}
            >
              <Typography
                variant="caption"
                sx={{
                  flexGrow: 1,
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  pl: 0.5,
                }}
              >
                {filename}
              </Typography>

              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteFile(id, filename)}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </FileCard>
          ))
        : null}

      <Notification
        open={isDeletedFile || isUsedFile}
        onClose={setStatus}
        isError={isUsedFile}
        isSuccess={isDeletedFile}
        message={statusMsg}
        autoHideDuration={3500}
      />
    </Grid>
  )
}
