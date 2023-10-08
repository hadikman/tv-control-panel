import * as React from 'react'
import {useDropzone} from 'react-dropzone'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import ClearIcon from '@mui/icons-material/Clear'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import SaveIcon from '@mui/icons-material/Save'
import {UPLOAD_FILE_API} from 'util/api-url'

const UPLOAD_URL = process.env.NEXT_PUBLIC_DOMAIN + UPLOAD_FILE_API

function DropZone() {
  const queryClient = useQueryClient()
  const {mutate, isLoading: isSending} = useMutation({
    mutationFn: newFormData =>
      fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: newFormData,
        timeout: 60000 * 10,
      }).then(res => res.json()),
    onSuccess: data => {
      queryClient.invalidateQueries({queryKey: ['media-files-data']})

      if (data.success) {
        setAcceptedFileArr([])
      }
    },
  })
  const [accpetedFileArr, setAcceptedFileArr] = React.useState([])
  const [rejectedFileArr, setRejectedFileArr] = React.useState([])

  const isAccpetedFileArr = accpetedFileArr.length > 0
  const isRejectedFileArr = rejectedFileArr.length > 0

  const handleCloseAlert = () => {
    setRejectedFileArr([])
  }

  const onDrop = React.useCallback((acceptedFiles, rejectedFiles) => {
    const isAcceptedFiles = acceptedFiles.length > 0
    const isRejectedFiles = rejectedFiles.length > 0

    if (isAcceptedFiles) {
      setAcceptedFileArr(prevState => [
        ...prevState,
        ...acceptedFiles.map(file =>
          Object.assign(file, {preview: URL.createObjectURL(file)}),
        ),
      ])
      setRejectedFileArr([])
    }

    if (isRejectedFiles) {
      setRejectedFileArr(prevState => rejectedFiles.map(file => file))
    }
  }, [])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      'video/mp4': ['.mp4'],
      'image/jpg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 10,
    maxSize: 1024 * 1000 * 1000 * 2,
    onDrop,
  })

  function handleRemoveFile(name) {
    setAcceptedFileArr(prevFile => prevFile.filter(file => file.name !== name))
  }

  async function handleOnSubmitOnUploadedFiles(e) {
    e.preventDefault()

    const formData = new FormData()

    accpetedFileArr.forEach(file => formData.append('file', file))

    // TODO send a POST request to the API
    mutate(formData)
  }

  function handleOnResetOnUploadedFiles(e) {
    e.preventDefault()

    setRejectedFileArr([])
  }

  return (
    <Stack
      component="form"
      onSubmit={handleOnSubmitOnUploadedFiles}
      onReset={handleOnResetOnUploadedFiles}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.75rem',
              textAlign: 'center',
              backgroundColor: '#fff',
              color: 'greyClr.main',
              border: '2px dashed',
              borderColor: 'greyClr.main',
              borderRadius: 'var(--sm-corner)',
              padding: '20px',
              cursor: 'pointer',
              transition: 'border .24s ease-in-out',
              ...(isFocused ? {borderColor: 'success.light'} : {}),
              ...(isDragAccept ? {borderColor: 'secondary.main'} : {}),
              ...(isDragReject ? {borderColor: 'error.main'} : {}),
            }}
            {...getRootProps({})}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>فایل خود را رها نمایید...</p>
            ) : (
              <p>
                فایل ویدئویی خود را در این قسمت بکشید و رها کنید یا با کلیک کردن
                آن را انتخاب نمایید
                <br />
                پسوندهای مجاز: mp4. jpg/jpeg. png.
              </p>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid
            container
            sx={{
              height: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: '#fff',
              borderRadius: 'var(--sm-corner)',
            }}
          >
            {accpetedFileArr.map(({name}) => (
              <Grid key={name} item xs={12}>
                <Alert
                  severity="success"
                  sx={{alignItems: 'center', fontSize: '0.75rem'}}
                  action={
                    <Button
                      type="submit"
                      variant="contained"
                      color="error"
                      sx={{p: 0}}
                      onClick={() => handleRemoveFile(name)}
                    >
                      <ClearIcon />
                    </Button>
                  }
                >
                  <AlertTitle sx={{fontSize: '0.625rem', fontWeight: 700}}>
                    {name}
                  </AlertTitle>
                </Alert>
              </Grid>
            ))}

            {rejectedFileArr.map(({file, errors}) => (
              <Alert
                key={file.name}
                severity="error"
                sx={{width: '100%'}}
                action={
                  <Button
                    variant="contained"
                    color="error"
                    sx={{height: '100%'}}
                    onClick={handleCloseAlert}
                  >
                    <ClearIcon />
                  </Button>
                }
              >
                <AlertTitle sx={{fontWeight: 700}}>{file.name}</AlertTitle>
                <ul>
                  {errors.map(({code, message}) => (
                    <li key={code}>{message}</li>
                  ))}
                </ul>
              </Alert>
            ))}

            {(isAccpetedFileArr || isRejectedFileArr) && (
              <Grid item xs={12} sx={{p: 1}}>
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={
                    isSending ? <CircularProgress size={18} /> : <SaveIcon />
                  }
                  disabled={isSending ? true : false}
                  color={isRejectedFileArr ? 'error' : 'success'}
                  type={isRejectedFileArr ? 'reset' : 'submit'}
                >
                  {isRejectedFileArr
                    ? 'فایل‌های غیر مجاز را حذف نمایید.'
                    : 'فایل‌ها مجاز می باشند. اکنون آپلود نمایید'}
                </Button>
              </Grid>
            )}
          </Grid>

          {isSending && <LinearProgress />}
        </Grid>
      </Grid>
    </Stack>
  )
}

export {DropZone}
