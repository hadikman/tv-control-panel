import * as React from 'react'
import axiosClient from 'util/axios-http'
import {UPLOAD_FILE_API} from 'util/api-url'
import {useDropzone} from 'react-dropzone'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Typography from '@mui/material/Typography'
import ClearIcon from '@mui/icons-material/Clear'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import DoneIcon from '@mui/icons-material/Done'

function DropZone() {
  const queryClient = useQueryClient()
  const {mutate, isLoading: isSending} = useMutation({
    mutationFn: newFormData =>
      axiosClient.post(UPLOAD_FILE_API, newFormData, {
        timeout: 60000 * 10,
      }),
    onSuccess: data => {
      queryClient.invalidateQueries({queryKey: ['media-files-data']})

      if (data.status === 200) {
        setAcceptedFileArr([])
        setIsUploaded(true)
      }
    },
  })
  const [accpetedFileArr, setAcceptedFileArr] = React.useState([])
  const [rejectedFileArr, setRejectedFileArr] = React.useState([])
  const [isUploaded, setIsUploaded] = React.useState(false)

  const isAccpetedFileArr = accpetedFileArr.length > 0
  const isRejectedFileArr = rejectedFileArr.length > 0
  const isMultipleFile = accpetedFileArr.length > 1

  React.useEffect(() => {
    let timeout

    if (isUploaded) {
      timeout = setTimeout(() => {
        setIsUploaded(false)
      }, 3000)
    }

    return () => clearTimeout(timeout)
  }, [isUploaded])

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
              bgcolor: isUploaded ? 'hsl(120 100% 50% / 0.25)' : '#fff',
              borderRadius: 'var(--sm-corner)',
              transition: theme =>
                `${theme.transitions.create(['background-color'])}`,
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
                    isSending ? (
                      <CircularProgress size={18} />
                    ) : (
                      <FileUploadIcon />
                    )
                  }
                  disabled={isSending ? true : false}
                  color={isRejectedFileArr ? 'error' : 'success'}
                  type={isRejectedFileArr ? 'reset' : 'submit'}
                >
                  {isRejectedFileArr
                    ? 'فایل‌های غیر مجاز را حذف نمایید.'
                    : `${
                        isMultipleFile
                          ? 'فایل‌ها مجاز می‌باشند.'
                          : 'فایل مجاز می‌باشد.'
                      } اکنون آپلود نمایید`}
                </Button>
              </Grid>
            )}

            {isUploaded && (
              <Typography
                variant="body1"
                sx={{textAlign: 'center', py: 1, px: 2, mx: 'auto'}}
              >
                {'با موفقیت بارگذاری شد'} <DoneIcon color="success" />
              </Typography>
            )}
          </Grid>

          {isSending && <LinearProgress />}
        </Grid>
      </Grid>
    </Stack>
  )
}

export {DropZone}
