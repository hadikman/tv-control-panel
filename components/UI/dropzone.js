import * as React from 'react'
import axiosClient from 'util/axios-http'
import {UPLOAD_FILE_API} from 'util/api-url'
import {useDropzone} from 'react-dropzone'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import VerifiedIcon from '@mui/icons-material/Verified'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ClearIcon from '@mui/icons-material/Clear'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import DoneIcon from '@mui/icons-material/Done'
import {bytesToMemoryUnit} from 'util/helper-functions'
import {customVerticalScrollbar} from 'util/scrollbar-group'

const UPLOAD_TIMEOUT = 60000 * 10
const MAX_FILES = 10
const MAX_SIZE = 1024 * 1024 * 1024 * 2

const validFileCondition = [
  'نام فایل نباید فارسی باشد.',
  'پسوندهای mp4/jpg/jpeg/png مجاز می‌باشد.',
  `حجم فایل تا ${bytesToMemoryUnit(MAX_SIZE)} مجاز می‌باشد.`,
  `حداکثر ${MAX_FILES} فایل برای بارگذاری همزمان مجاز می ‌باشد.`,
]
const aliasNames = {
  'non-english-filename':
    'نام فایل دارای حروف/عدد فارسی یا کاراکترهای غیر مجاز است.',
  'file-invalid-type': 'فایل باید mp4/jpg/jpeg/png باشد.',
  'file-too-large': `حجم فایل باید کمتر از ${bytesToMemoryUnit(
    MAX_SIZE,
  )} باشد.`,
  'too-many-files': `حداکثر باید ${MAX_FILES} فایل بطور همزمان بارگذاری شود.`,
}

function filenameValidator(file) {
  const {name} = file
  const regex = /^[a-zA-Z0-9\s\-._()]+$/

  const isValidFileName = regex.test(name)

  if (!isValidFileName) {
    return {
      code: 'non-english-filename',
      message: 'Name has non-English characters.',
    }
  }

  return null
}

function DropZone() {
  const queryClient = useQueryClient()
  const {mutate, isLoading: isSending} = useMutation({
    mutationFn: newFormData =>
      axiosClient
        .post(UPLOAD_FILE_API, newFormData, {
          timeout: UPLOAD_TIMEOUT,
        })
        .then(res => res.data),
    onSuccess: data => {
      queryClient.invalidateQueries({queryKey: ['media-files-data']})

      if (data.success) {
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
      // eslint-disable-next-line no-unused-vars
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
    maxFiles: MAX_FILES,
    maxSize: MAX_SIZE,
    onDrop,
    validator: filenameValidator,
  })

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

  function handleDeleteFile(name) {
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
      sx={{
        maxHeight: '10.5rem',
        overflowY: 'auto',
        pr: 1,
        ...customVerticalScrollbar,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} md={5}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              backgroundColor: '#fff',
              color: 'greyClr.main',
              border: '2px dashed',
              borderColor: 'greyClr.main',
              borderRadius: 'var(--sm-corner)',
              padding: 2,
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
              <Typography variant="body1">فایل خود را رها نمایید...</Typography>
            ) : (
              <Box>
                <Typography variant="caption">
                  فایل ویدئویی خود را در این قسمت رها کنید یا با کلیک کردن آن را
                  انتخاب نمایید:
                </Typography>
                <List
                  dense
                  disablePadding
                  sx={{fontWeight: theme => theme.typography.fontWeightBold}}
                >
                  {validFileCondition.map(file => (
                    <ListItem key={file}>• {file}</ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Grid
            container
            sx={{
              height: '100%',
              bgcolor: isUploaded ? 'hsl(120 100% 50% / 0.25)' : '#fff',
              borderRadius: 'var(--sm-corner)',
              transition: theme =>
                `${theme.transitions.create(['background-color'])}`,
            }}
          >
            <List dense disablePadding sx={{width: '100%'}}>
              {accpetedFileArr.map(({name}) => (
                <ListItem
                  key={name}
                  divider
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteFile(name)}
                    >
                      <ClearIcon color="error" />
                    </IconButton>
                  }
                  sx={{py: 1}}
                >
                  <ListItemIcon>
                    <VerifiedIcon color="success" />
                  </ListItemIcon>
                  <ListItemText>{name}</ListItemText>
                </ListItem>
              ))}

              {rejectedFileArr.map(({file, errors}) => (
                <ListItem
                  key={file.name}
                  divider
                  secondaryAction={
                    <IconButton edge="end" onClick={handleCloseAlert}>
                      <ClearIcon color="error" />
                    </IconButton>
                  }
                  sx={{color: 'error.dark', py: 1}}
                >
                  <ListItemIcon>
                    <ErrorOutlineIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    secondary={errors.map(({code, message}) => (
                      <Box component="span" key={code} sx={{mr: 0.5}}>
                        {aliasNames[code] || message}
                      </Box>
                    ))}
                    secondaryTypographyProps={{
                      sx: {fontSize: '0.75rem', mr: 0.5},
                    }}
                  >
                    {file.name}
                  </ListItemText>
                </ListItem>
              ))}
            </List>

            {(isAccpetedFileArr || isRejectedFileArr) && (
              <Grid item xs={12} sx={{alignSelf: 'flex-end', p: 1}}>
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={
                    isSending ? (
                      <CircularProgress size={18} />
                    ) : isRejectedFileArr ? null : (
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

                {isSending && <LinearProgress />}
              </Grid>
            )}

            {isUploaded && (
              <Typography
                variant="body1"
                sx={{textAlign: 'center', py: 1, px: 2, mx: 'auto'}}
              >
                {'با موفقیت بارگذاری گردید'} <DoneIcon color="success" />
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  )
}

export {DropZone}
