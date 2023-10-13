import * as React from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {ZonesCard, SendButton} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Skeleton from '@mui/material/Skeleton'
import {fetchAndPostData} from 'util/helper-functions'
import {GET_ZONES_API, ADD_ZONE_API} from 'util/api-url'

const GET_ZONES_URL = process.env.NEXT_PUBLIC_DOMAIN + GET_ZONES_API
const ADD_ZONE_URL = process.env.NEXT_PUBLIC_DOMAIN + ADD_ZONE_API

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
    queryFn: () => fetchAndPostData(GET_ZONES_URL),
  })
  const {
    mutate,
    isLoading: isSending,
    isSuccess: isSent,
  } = useMutation({
    mutationFn: newZone => {
      return fetchAndPostData(ADD_ZONE_URL, {
        body: JSON.stringify(newZone),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['zones-data']})
    },
  })
  const [zoneName, setZoneName] = React.useState('')
  const [inputErrorMessage, setInputErrorMessage] = React.useState('')

  let zonesData = []

  const isInputError = inputErrorMessage !== ''

  if (isSuccess) {
    zonesData = data.data
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
          height: 472,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 3,
          py: 3,
          overflowY: 'auto',
          ...customScrollbar,
        }}
      >
        {isLoading ? (
          <Skeleton variant="rounded" width={240} height={250} />
        ) : (
          zonesData.map(({id, ...props}) => (
            <Box key={id} sx={{width: '100%'}}>
              <ZonesCard
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
        )}
      </Grid>
    </Box>
  )
}

export default ZonesPage
