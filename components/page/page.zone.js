import * as React from 'react'
import axiosClient from 'util/axios-http'
import {GET_STANDS_API, ADD_STAND_API, DELETE_STAND_API} from 'util/api-url'
import {useRouter} from 'next/router'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {FilesAndTimeline, SendButton, Notification} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import {customVerticalScrollbar} from 'util/scrollbar-group'

export default function Zone() {
  const router = useRouter()
  const {q} = router.query
  const queryClient = useQueryClient()
  const {data, isLoading, isSuccess} = useQuery({
    queryKey: ['stands-data', q],
    queryFn: () => axiosClient.post(GET_STANDS_API, {zoneID: +q}),
  })
  const {mutate: mutateToDeleteStand, isSuccess: isDeletedSuccessfully} =
    useMutation({
      mutationFn: stand => axiosClient.post(DELETE_STAND_API, stand),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['stands-data', q]})
      },
    })
  const [status, setStatus] = React.useState('')

  let standsData = []
  let totalStands = 0
  let isEmptyStand = false

  const isDeletedStand = status === 'deleted'

  const statusMsg = isDeletedStand ? 'استند با موفقیت حذف گردید' : ''

  if (isSuccess) {
    if (data.data.success) {
      standsData = data.data.data
      totalStands = standsData.length
      isEmptyStand = standsData.length === 0
    }
  }

  React.useEffect(() => {
    if (isDeletedSuccessfully) {
      setStatus('deleted')
    }
  }, [isDeletedSuccessfully])

  function handleOnDeleteStand(standID, name) {
    const isConfirmed = confirm(`آیا استند "${name}" حذف شود؟`)

    if (isConfirmed) {
      mutateToDeleteStand({zoneID: +q, standID, name})
    }
  }

  return (
    <Box>
      <Box sx={{mb: 2}}>
        <Grid container spacing={1} sx={{'--inline-gap': '16px'}}>
          <Grid item xs={12} md="auto">
            <Grid
              container
              sx={{
                height: '80px',
                alignItems: 'center',
                gap: 'var(--inline-gap)',
                textAlign: 'center',
                border: 'thin solid',
                borderColor: 'hsl(0 0% 80%)',
                borderRadius: 'var(--sm-corner)',
                py: 0.5,
                px: 'var(--inline-gap)',
              }}
            >
              <Grid item>
                <Typography variant="body2">
                  کل استند های متصل: <strong>{totalStands}</strong>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  کل انلاین ها: <strong>0</strong>
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md>
            <NewStandForm />
          </Grid>
        </Grid>
      </Box>

      <Divider />

      <Box
        sx={{
          maxHeight: '30rem',
          overflowY: 'auto',
          pr: 1,
          ...customVerticalScrollbar,
        }}
      >
        <Box sx={{my: 2}}>
          <Grid container spacing={1.5} sx={{textAlign: 'center', pl: 0.75}}>
            {isLoading ? (
              [1, 2].map(item => (
                <Grid key={item} item xs="auto">
                  <Skeleton variant="rounded" width={144} height={64} />
                </Grid>
              ))
            ) : isEmptyStand ? (
              <Grid item xs="auto">
                <Typography variant="body2">
                  لطفاً حداقل یک استند اضافه نمایید.
                </Typography>
              </Grid>
            ) : (
              standsData.map(({id, ...props}) => (
                <Grid key={id} item xs="auto">
                  <Stand
                    id={id}
                    deleteStandFn={handleOnDeleteStand}
                    {...props}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Box>

        <Divider />

        <Box sx={{mt: 2}}>
          <FilesAndTimeline />
        </Box>
      </Box>

      <Notification
        open={isDeletedStand}
        onClose={setStatus}
        isSuccess={isDeletedStand}
        message={statusMsg}
        autoHideDuration={3000}
      />
    </Box>
  )
}

function NewStandForm() {
  const router = useRouter()
  const {q} = router.query
  const queryClient = useQueryClient()
  const {
    mutate,
    isLoading: isSending,
    isSuccess: isSent,
    data: newStandResponse,
  } = useMutation({
    mutationFn: newStand => axiosClient.post(ADD_STAND_API, newStand),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['stands-data', q]})
    },
  })

  const [standName, setStandName] = React.useState('')
  const [ipNumString, setIpNumString] = React.useState('')
  const [macAddress, setMacAddress] = React.useState('')
  const [standNameErrorMessage, setStandNameErrorMessage] = React.useState('')
  const [ipNumErrorMessage, setIpNumErrorMessage] = React.useState('')
  const [macAddressErrorMessage, setMacAddressErrorMessage] = React.useState('')
  const [status, setStatus] = React.useState('')

  const isStandNameError = standNameErrorMessage !== ''
  const isIpNumError = ipNumErrorMessage !== ''
  const isMacAddressError = macAddressErrorMessage !== ''
  const isRegisteredNewStand = status === 'registered'
  const isInvalidIp = status === 'invalid ip'
  const isInvalidMac = status === 'invalid mac'
  const isDuplicated = status === 'duplicated'
  const isNewStandError = isInvalidIp || isInvalidMac || isDuplicated

  const statusMsg = isRegisteredNewStand
    ? 'استند جدید با موفقیت اضافه گردید'
    : isInvalidIp
    ? 'این آدرس آی پی معتبر نیست'
    : isInvalidMac
    ? 'این مک آدرس معتبر نیست'
    : isDuplicated
    ? 'این شماره آی پی/مک آدرس قبلاً ثبت شده است'
    : ''

  React.useEffect(() => {
    if (newStandResponse) {
      if (newStandResponse.data.success) {
        setStatus('registered')
      } else {
        const {message} = newStandResponse.data

        switch (message) {
          case 'ip address not valid':
            setStatus('invalid ip')
            break
          case 'mac address not valid':
            setStatus('invalid mac')
            break
          case 'duplicated':
            setStatus('duplicated')
            break
          default:
            break
        }
      }
    }
  }, [newStandResponse])

  function handleOnStandName(e) {
    setStandName(e.target.value)
  }

  function handleOnIpNumString(e) {
    setIpNumString(e.target.value)
  }

  function handleOnMacAddress(e) {
    setMacAddress(e.target.value)
  }

  function handleOnFocusStandNameInput() {
    setStandNameErrorMessage('')
  }

  function handleOnFocusIpNumInput() {
    setIpNumErrorMessage('')
  }

  function handleOnFocusMacAddressInput() {
    setMacAddressErrorMessage('')
  }

  function handleOnSubmitForm(e) {
    e.preventDefault()

    const isEmptyStandName = standName === ''
    const isEmptyIpNUm = ipNumString === ''
    const isEmptyMacAddress = macAddress === ''
    const isEmptyInput = isEmptyStandName || isEmptyIpNUm || isEmptyMacAddress

    if (isEmptyInput) {
      if (isEmptyStandName) {
        setStandNameErrorMessage('وارد کردن یک نام برای استند الزامی است')
      }
      if (isEmptyIpNUm) {
        setIpNumErrorMessage('وارد کردن یک آی پی برای استند الزامی است')
      }
      if (isEmptyMacAddress) {
        setMacAddressErrorMessage('وارد کردن یک مک آدرس برای استند الزامی است')
      }

      return
    }

    const validIp = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/
    const validMacAddress =
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}.[0-9a-fA-F]{4}.[0-9a-fA-F]{4})$/

    const isValidIp = validIp.test(ipNumString.trim())
    const isValidMacAddress = validMacAddress.test(macAddress.trim())
    const isInvalidInput = !isValidIp || !isValidMacAddress

    if (isInvalidInput) {
      if (!isValidIp) {
        setIpNumErrorMessage('شماره آی پی صحیح نیست')
      }
      if (!isValidMacAddress) {
        setMacAddressErrorMessage('مک آدرس صحیح نیست')
      }

      return
    }

    mutate({
      name: standName.trim(),
      ip: ipNumString.trim(),
      mac: macAddress.trim(),
      zoneID: +q,
    })

    setStandName('')
    setIpNumString('')
    setMacAddress('')
  }

  return (
    <Box>
      <Grid
        container
        component="form"
        sx={{
          minHeight: '80px',
          justifyContent: 'center',
          alignItems: 'baseline',
          gap: 4,
          border: 'thin solid',
          borderColor: 'hsl(0 0% 80%)',
          borderRadius: 'var(--sm-corner)',
          py: 0.5,
          px: 'var(--inline-gap)',
        }}
        onSubmit={handleOnSubmitForm}
      >
        <TextField
          id="stand-name"
          variant="standard"
          label="استند جدید"
          placeholder="استند شماره یک"
          helperText={standNameErrorMessage}
          error={isStandNameError}
          value={standName}
          onChange={handleOnStandName}
          inputProps={{onFocus: handleOnFocusStandNameInput}}
          sx={{maxWidth: '14rem', flex: '1 0 7rem'}}
        />
        <TextField
          id="stand-ip"
          variant="standard"
          label="آی پی جدید"
          placeholder="192.168.1.10"
          helperText={ipNumErrorMessage}
          error={isIpNumError}
          value={ipNumString}
          onChange={handleOnIpNumString}
          inputProps={{onFocus: handleOnFocusIpNumInput}}
          sx={{maxWidth: '14rem', flex: '1 0 7rem'}}
        />
        <TextField
          id="stand-mac"
          variant="standard"
          label="مک آدرس جدید"
          placeholder="3D:F2:C9:A2:B3:4F"
          helperText={macAddressErrorMessage}
          error={isMacAddressError}
          value={macAddress}
          onChange={handleOnMacAddress}
          inputProps={{onFocus: handleOnFocusMacAddressInput}}
          sx={{maxWidth: '14rem', flex: '1 0 7rem'}}
        />

        <SendButton
          lableText="افزودن"
          isSending={isSending}
          isSuccess={isSent}
          isError={isNewStandError}
        />
      </Grid>

      <Notification
        open={isNewStandError || isRegisteredNewStand}
        onClose={setStatus}
        isError={isNewStandError}
        isSuccess={isRegisteredNewStand}
        message={statusMsg}
        autoHideDuration={3000}
      />
    </Box>
  )
}

function Stand({id, name, ip, mac, online = true, deleteStandFn}) {
  return (
    <Paper
      variant={online ? 'elevation' : 'outlined'}
      elevation={5}
      sx={{
        minWidth: 140,
        width: 140,
        bgcolor: 'hsl(0 0% 90%)',
        p: 1,
      }}
    >
      <Box sx={{mb: 1}}>
        <Typography variant="body2" sx={{fontWeight: 700}}>
          {name}
        </Typography>
        <Typography variant="body2">{ip}</Typography>
        <Typography variant="body2">{mac}</Typography>
      </Box>

      <ButtonGroup variant="contained" size="small">
        <Button color={online ? 'success' : 'info'}>
          {online ? <PlayArrowIcon /> : <StopIcon />}
        </Button>
        <Button color="error" onClick={() => deleteStandFn(id, name)}>
          حذف
        </Button>
      </ButtonGroup>
      <Box></Box>
    </Paper>
  )
}
