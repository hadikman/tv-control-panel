import * as React from 'react'
import axiosClient from 'util/axios-http'
import {GET_ZONES_API, ADD_ZONE_API} from 'util/api-url'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {ZoneCard, SendButton} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Skeleton from '@mui/material/Skeleton'
import {generateListOfIndex} from 'util/helper-functions'

const customScrollbar = {
  '&::-webkit-scrollbar': {
    width: '0.45rem',
  },
  '&::-webkit-scrollbar-track': {
    bgcolor: 'lightClr.main',
    p: 1,
    borderRadius: '10rem',
  },
  '&::-webkit-scrollbar-thumb': {
    width: '8rem',
    bgcolor: 'hsl(0 0% 55%)',
    borderRadius: '10rem',
    ':hover': {
      bgcolor: 'hsl(0 0% 35%)',
    },
  },
}

function ZonesPage({...props}) {
  const queryClient = useQueryClient()
  const {data, isLoading, isSuccess} = useQuery({
    queryKey: ['zones-data'],
    queryFn: () => axiosClient.post(GET_ZONES_API),
  })
  const {
    mutate,
    isLoading: isSending,
    isSuccess: isSent,
  } = useMutation({
    mutationFn: newZone => axiosClient.post(ADD_ZONE_API, newZone),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['zones-data']})
    },
  })
  const [zoneName, setZoneName] = React.useState('')
  const [inputErrorMessage, setInputErrorMessage] = React.useState('')

  let zonesData = []

  const isInputError = inputErrorMessage !== ''

  const generatedListOfIndex = generateListOfIndex(4)

  if (isSuccess) {
    zonesData = data.data.data
  }

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

    mutate({name: zoneName})

    setZoneName('')
  }

  return (
    <Box {...props}>
      <Box sx={{height: '80px', mb: 1, py: 1}}>
        <Stack
          component="form"
          sx={{flexDirection: 'row', alignItems: 'baseline', gap: 4}}
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
            isSent={isSent}
          />
        </Stack>
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
          ...customScrollbar,
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
                  slug={`zone?q=${id}`}
                  videosCount={
                    id === 1
                      ? []
                      : [
                          'img-4',
                          'img-5',
                          'img-6',
                          'img-7',
                          'img-8',
                          'img-9',
                          'img-10',
                        ]
                  }
                  {...props}
                />
              </Box>
            ))
          : null}
      </Grid>
    </Box>
  )
}

export default ZonesPage
