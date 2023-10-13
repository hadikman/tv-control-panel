import * as React from 'react'
import {useRouter} from 'next/router'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {FilesAndTimeline, SendButton} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Skeleton from '@mui/material/Skeleton'
import {fetchAndPostData} from 'util/helper-functions'
import {GET_STANDS_API, ADD_STAND_API} from 'util/api-url'

const GET_STANDS_URL = process.env.NEXT_PUBLIC_DOMAIN + GET_STANDS_API
const ADD_STAND_URL = process.env.NEXT_PUBLIC_DOMAIN + ADD_STAND_API

function Zone() {
  const router = useRouter()
  const {q} = router.query
  const queryClient = useQueryClient()
  const {data, isLoading, isSuccess} = useQuery({
    queryKey: ['stands-data', q],
    queryFn: () =>
      fetchAndPostData(GET_STANDS_URL, {
        body: JSON.stringify({zoneID: +q}),
      }),
  })
  const {
    mutate,
    isLoading: isSending,
    isSuccess: isSent,
  } = useMutation({
    mutationFn: newStand => {
      return fetchAndPostData(ADD_STAND_URL, {
        body: JSON.stringify(newStand),
      })
    },
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
    if (data.success) {
      standsData = data.data
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
        <Grid container>
          <Grid item xs={6}>
            کل استند های متصل: {totalStands}
          </Grid>
          <Grid item xs={6}>
            کل انلاین ها: 0
          </Grid>
        </Grid>
      </Box>

      <Box sx={{height: '80px', mb: 1, py: 1}}>
        <Grid
          container
          component="form"
          sx={{flexDirection: 'row', alignItems: 'baseline', gap: 4}}
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
      </Box>

      <Divider />

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
  )
}

export default Zone
