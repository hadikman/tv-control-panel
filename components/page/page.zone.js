import * as React from 'react'
import axiosClient from 'util/axios-http'
import {GET_STANDS_API, ADD_STAND_API} from 'util/api-url'
import {useRouter} from 'next/router'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {FilesAndTimeline, SendButton} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Skeleton from '@mui/material/Skeleton'
import {customVerticalScrollbar} from 'util/scrollbar-group'

function Zone() {
  const router = useRouter()
  const {q} = router.query
  const queryClient = useQueryClient()
  const {data, isLoading, isSuccess} = useQuery({
    queryKey: ['stands-data', q],
    queryFn: () => axiosClient.post(GET_STANDS_API, {zoneID: +q}),
  })
  const {
    mutate,
    isLoading: isSending,
    isSuccess: isSent,
  } = useMutation({
    mutationFn: newStand => axiosClient.post(ADD_STAND_API, newStand),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['stands-data', q]})
    },
  })
  const [standName, setStandName] = React.useState('')
  const [ipNumString, setIpNumString] = React.useState('')
  const [standNameErrorMessage, setStandNameErrorMessage] = React.useState('')
  const [ipNumErrorMessage, setIpNumErrorMessage] = React.useState('')

  let standsData = []
  let totalStands = 0
  let isEmptyStand = false

  const isStandNameError = standNameErrorMessage !== ''
  const isIpNumError = ipNumErrorMessage !== ''

  if (isSuccess) {
    if (data.data.success) {
      standsData = data.data.data
      totalStands = standsData.length
      isEmptyStand = standsData.length === 0
    }
  }

  function handleOnStandName(e) {
    setStandName(e.target.value)
  }

  function handleOnIpNumString(e) {
    setIpNumString(e.target.value)
  }

  function handleOnFocusStandNameInput() {
    setStandNameErrorMessage('')
  }

  function handleOnFocusIpNumInput() {
    setIpNumErrorMessage('')
  }

  function handleOnSubmitForm(e) {
    e.preventDefault()

    const isEmptyStandName = standName === ''
    const isEmptyIpNUm = ipNumString === ''
    const isEmptyInput = isEmptyStandName || isEmptyIpNUm

    if (isEmptyInput) {
      if (isEmptyStandName) {
        setStandNameErrorMessage('وارد کردن یک نام برای استند الزامی است')
      }
      if (isEmptyIpNUm) {
        setIpNumErrorMessage('وارد کردن یک آی پی برای استند الزامی است')
      }

      return
    }

    mutate({
      name: standName,
      ip: ipNumString,
      zoneID: +q,
    })

    setStandName('')
    setIpNumString('')
  }

  return (
    <Box>
      <Box sx={{mb: 2}}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <Grid
              container
              sx={{
                height: '80px',
                alignItems: 'center',
                textAlign: 'center',
                border: 'thin solid',
                borderColor: 'hsl(0 0% 80%)',
                borderRadius: 'var(--sm-corner)',
                py: 0.5,
                px: 1,
              }}
            >
              <Grid item xs>
                کل استند های متصل: {totalStands}
              </Grid>
              <Grid item xs>
                کل انلاین ها: 0
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid
              container
              component="form"
              sx={{
                height: '80px',
                flexDirection: 'row',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: 4,
                border: 'thin solid',
                borderColor: 'hsl(0 0% 80%)',
                borderRadius: 'var(--sm-corner)',
                py: 0.5,
                px: 1,
              }}
              onSubmit={handleOnSubmitForm}
            >
              <TextField
                id="stand-name"
                variant="standard"
                label="استند جدید"
                placeholder="یک نام وارد نمایید"
                helperText={standNameErrorMessage}
                error={isStandNameError}
                value={standName}
                onChange={handleOnStandName}
                inputProps={{onFocus: handleOnFocusStandNameInput}}
              />
              <TextField
                id="stand-ip"
                variant="standard"
                label="آی پی جدید"
                placeholder="شماره آی پی"
                helperText={ipNumErrorMessage}
                error={isIpNumError}
                value={ipNumString}
                onChange={handleOnIpNumString}
                inputProps={{onFocus: handleOnFocusIpNumInput}}
              />

              <SendButton
                lableText="افزودن"
                isSending={isSending}
                isSent={isSent}
              />
            </Grid>
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
          <Grid
            container
            spacing={1}
            sx={{textAlign: 'center', alignItems: 'center'}}
          >
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
              standsData.map(({id, name, ip}) => (
                <Grid key={id} item xs={2}>
                  <Box
                    sx={{
                      bgcolor: 'hsl(0 0% 85%)',
                      borderRadius: 'var(--sm-corner)',
                      p: 1,
                      ':hover': {
                        bgcolor: 'greyClr.main',
                      },
                    }}
                  >
                    <Typography variant="body1">{name}</Typography>
                    <Typography variant="caption">آی پی : {ip}</Typography>
                  </Box>
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
    </Box>
  )
}

export default Zone
