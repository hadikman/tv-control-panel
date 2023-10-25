import * as React from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import axiosClient from 'util/axios-http'
import {GET_ZONES_API, ADD_ZONE_API, DELETE_ZONE_API} from 'util/api-url'
import ZoneCard from 'components/UI/zone-card'
import SendButton from 'components/UI/send-button'
import Notification from 'components/UI/notification'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Skeleton from '@mui/material/Skeleton'
import {generateListOfIndex} from 'util/helper-functions'
import {customVerticalScrollbar} from 'util/scrollbar-group'

export default function ZonesPage({...props}) {
  const queryClient = useQueryClient()
  const {data, isLoading, isSuccess} = useQuery({
    queryKey: ['zones-data'],
    queryFn: () => axiosClient.post(GET_ZONES_API).then(res => res.data),
  })

  const {mutate: mutateToDeleteZone, isSuccess: isDeletedSuccessfully} =
    useMutation({
      mutationFn: zone =>
        axiosClient.post(DELETE_ZONE_API, zone).then(res => res.data),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['zones-data']})
      },
    })

  const [status, setStatus] = React.useState('')

  let zonesData = []

  const isDeletedZone = status === 'deleted'

  const statusMsg = isDeletedZone ? 'زون با موفقیت حذف گردید' : ''

  const generatedListOfIndex = generateListOfIndex(4)

  if (isSuccess) {
    zonesData = data.data
  }

  React.useEffect(() => {
    if (isDeletedSuccessfully) {
      setStatus('deleted')
    }
  }, [isDeletedSuccessfully])

  function handleOnDeleteZone(zoneID, name) {
    const isConfirmed = confirm(`آیا زون "${name}" حذف شود؟`)

    if (isConfirmed) {
      mutateToDeleteZone({zoneID, name})
    }
  }

  return (
    <Box {...props}>
      <Box sx={{mb: 1, py: 1}}>
        <NewZoneForm />
      </Box>

      <Divider />

      <Grid
        sx={{
          '--zone-container-height': '472px',
          '--zone-card-width': '250px',
          maxHeight: 'var(--zone-container-height)',
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(var(--zone-card-width), 1fr))',
          gap: 3,
          py: 3,
          pr: 1,
          overflowY: 'auto',
          ...customVerticalScrollbar,
        }}
      >
        {isLoading
          ? generatedListOfIndex.map(item => (
              <Grid key={item} item>
                <Skeleton
                  variant="rounded"
                  width="var(--zone-card-width)"
                  height="13rem"
                />
              </Grid>
            ))
          : isSuccess
          ? zonesData.map(({id, ...props}) => (
              <Box key={id} sx={{width: '100%'}}>
                <ZoneCard
                  id={id}
                  deleteZoneFn={handleOnDeleteZone}
                  {...props}
                />
              </Box>
            ))
          : null}
      </Grid>

      <Notification
        open={isDeletedZone}
        onClose={setStatus}
        isSuccess={isDeletedZone}
        message={statusMsg}
      />
    </Box>
  )
}

function NewZoneForm() {
  const queryClient = useQueryClient()
  const {
    data: newZoneResponse,
    mutate: mutateToAddZone,
    isLoading: isSending,
    isSuccess: isAddedSuccessfully,
  } = useMutation({
    mutationFn: newZone =>
      axiosClient.post(ADD_ZONE_API, newZone).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['zones-data']})
    },
  })
  const [zoneName, setZoneName] = React.useState('')
  const [inputErrorMessage, setInputErrorMessage] = React.useState('')
  const [status, setStatus] = React.useState('')

  const isInputError = inputErrorMessage !== ''
  const isAddedZone = status === 'added'
  const isDuplicated = status === 'duplicated'

  const statusMsg = isAddedZone
    ? 'زون با موفقیت اضافه گردید'
    : isDuplicated
    ? 'این زون قبلاً ثبت شده است'
    : ''

  React.useEffect(() => {
    if (newZoneResponse) {
      if (newZoneResponse.success) {
        setStatus('added')
      } else {
        setStatus('duplicated')
      }
    }
  }, [isAddedSuccessfully, newZoneResponse])

  function handleInput(e) {
    setZoneName(e.target.value)
  }

  function handleOnFocusInput() {
    setInputErrorMessage('')
  }

  function handleOnSubmitForm(e) {
    e.preventDefault()

    const isEmptyInput = zoneName === ''

    if (isEmptyInput) {
      setInputErrorMessage('وارد کردن یک نام برای زون الزامی است')

      return
    }

    mutateToAddZone({name: zoneName.trim()})

    setZoneName('')
  }

  return (
    <Box sx={{height: '56px'}}>
      <Stack
        component="form"
        sx={{
          flexDirection: 'row',
          alignItems: 'baseline',
          gap: 4,
        }}
        onSubmit={handleOnSubmitForm}
      >
        <TextField
          id="add-zone"
          variant="standard"
          label="زون جدید"
          placeholder="یک نام وارد نمایید"
          value={zoneName}
          helperText={inputErrorMessage}
          error={isInputError}
          onChange={handleInput}
          inputProps={{onFocus: handleOnFocusInput}}
        />

        <SendButton
          lableText="افزودن"
          isSending={isSending}
          isSuccess={isAddedSuccessfully}
          isError={isDuplicated}
        />
      </Stack>

      <Notification
        open={isAddedZone || isDuplicated}
        onClose={setStatus}
        isSuccess={isAddedZone}
        isError={isDuplicated}
        message={statusMsg}
      />
    </Box>
  )
}
