import * as React from 'react'
import {useDropzone} from 'react-dropzone'
import {Form} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ClearIcon from '@mui/icons-material/Clear'

function DropZone() {
  const [accpetedFileArr, setAcceptedFileArr] = React.useState([])
  const [rejectedFileArr, setRejectedFileArr] = React.useState([])

  const handleCloseAlert = () => {
    setRejectedFileArr([])
  }

  const onDrop = React.useCallback((acceptedFiles, rejectedFiles) => {
    const isAcceptedFiles = acceptedFiles.length > 0
    const isRejectedFiles = rejectedFiles.length > 0

    if (isAcceptedFiles) {
      setAcceptedFileArr(acceptedFiles)
      setRejectedFileArr([])
    }

    if (isRejectedFiles) {
      setRejectedFileArr(rejectedFiles)
      setAcceptedFileArr([])
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
    maxFiles: 1,
    maxSize: 1024 * 1000 * 1000,
    multiple: false,
    onDrop,
  })

  function handleRemoveFile(name) {
    return () => {
      setAcceptedFileArr(prevFile =>
        prevFile.filter(file => file.name !== name),
      )
    }
  }

  function handleSubmitOnUploadedFile(e) {
    e.preventDefault()

    // TODO send a POST request to the API
    console.log(accpetedFileArr)
    setAcceptedFileArr([])
  }

  return (
    <Stack component="form" onSubmit={handleSubmitOnUploadedFile}>
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
              backgroundColor: '#fff',
              borderRadius: 'var(--sm-corner)',
              px: 2,
            }}
          >
            {accpetedFileArr.map(({name}) => (
              <React.Fragment key={name}>
                <Grid item xs={10}>
                  <Alert
                    severity="success"
                    sx={{fontSize: '0.875rem'}}
                    action={
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        sx={{height: '100%'}}
                        onClick={handleCloseAlert}
                      >
                        <CloudUploadIcon />
                      </Button>
                    }
                  >
                    <AlertTitle>{name}</AlertTitle>
                    فایل مجاز می باشد. اکنون آپلود نمایید
                  </Alert>
                </Grid>

                <Grid item xs={2} sx={{textAlign: 'center'}}>
                  <Button
                    size="small"
                    color="error"
                    sx={{height: '100%'}}
                    onClick={handleRemoveFile(name)}
                  >
                    <ClearIcon />
                  </Button>
                </Grid>
              </React.Fragment>
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
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  )
}

export {DropZone}
