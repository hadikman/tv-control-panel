import * as React from 'react'
import useQueryData from 'hook/useQueryData'
import useMutateData from 'hook/useMutateData'
import {GET_FILE_LIST_API, DELETE_FILE_API} from 'util/api-url'
import FileCard from 'components/UI/file-card'
import Notification from 'components/UI/notification'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import ClearIcon from '@mui/icons-material/Clear'
import {generateListOfIndex} from 'util/helper-functions'
import {customVerticalScrollbar} from 'util/scrollbar-group'

export default function PreviewMediaFiles() {
  const {data, isLoading, isSuccess} = useQueryData({
    queryKey: ['media-files-data'],
    url: GET_FILE_LIST_API,
  })
  const {
    data: deleteFileResponse,
    mutate: mutateToDeleteFile,
    isSuccess: isDeletedSuccessfully,
  } = useMutateData({
    url: DELETE_FILE_API,
    queryKey: ['media-files-data'],
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
    if (data.success) {
      filesData = data.data.files
    }
  }

  React.useEffect(() => {
    if (isDeletedSuccessfully) {
      if (deleteFileResponse.success) {
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
    <Box
      sx={{
        bgcolor: 'hsl(0 0% 88%)',
        borderRadius: 'var(--sm-corner)',
        p: 2,
      }}
    >
      <Grid
        container
        sx={{
          '--card-size': '6rem',
          '--gap': '6px',
          height: 359,
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
    </Box>
  )
}
