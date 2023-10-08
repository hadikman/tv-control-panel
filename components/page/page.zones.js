import * as React from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {ZonesCard} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Skeleton from '@mui/material/Skeleton'
import {zones} from 'util/dummy-data'
import {fetchAndPostData} from 'util/helper-functions'
import {GET_ZONES_API, ADD_ZONE_API} from 'util/api-url'

const GET_ZONES_URL = process.env.NEXT_PUBLIC_DOMAIN + GET_ZONES_API
const ADD_ZONE_URL = process.env.NEXT_PUBLIC_DOMAIN + ADD_ZONE_API

function ZonesPage({...props}) {
  const queryClient = useQueryClient()
  const {data, isLoading, isSuccess} = useQuery({
    queryKey: ['zones-data'],
    queryFn: () => fetchAndPostData(GET_ZONES_URL),
  })
  const {mutate} = useMutation({
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

  let zonesData = []

  if (isSuccess) {
    zonesData = data.data
  }

  function handleInput(e) {
    setZoneName(e.target.value)
  }

  function handleOnSubmitForm(e) {
    e.preventDefault()

    // TODO send a POST request to the API
    mutate({name: zoneName})
    // console.log({name: zoneName})

    setZoneName('')
  }

  return (
    <Box {...props}>
      <Box sx={{mb: 1, py: 3}}>
        <Stack
          component="form"
          sx={{flexDirection: 'row', alignItems: 'baseline', gap: 4}}
          onSubmit={handleOnSubmitForm}
        >
          <TextField
            id="add-zone"
            placeholder="نام زون جدید"
            value={zoneName}
            // helperText="فضای رزرو پیغام خطا"
            variant="standard"
            onChange={handleInput}
          />

          <Button
            variant="contained"
            sx={{
              fontSize: '0.875rem',
            }}
            color="accentClr"
            type="submit"
          >
            افزودن
          </Button>
        </Stack>
      </Box>

      <Divider />

      <Grid
        sx={{
          height: 472,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          alignContent: 'center',
          gap: 3,
          py: 3,
          overflowY: 'auto',
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
