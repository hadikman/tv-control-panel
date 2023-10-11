import * as React from 'react'
import {useRouter} from 'next/router'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {FilesAndTimeline} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import AddIcon from '@mui/icons-material/Add'
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
  const {mutate} = useMutation({
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

  let standsData = []
  let totalStands = 0
  let isEmptyStand = false

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

  function handleOnSubmitForm(e) {
    e.preventDefault()

    // TODO send a POST request to the API
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

      <Box sx={{mb: 1, py: 3}}>
        <Grid
          container
          component="form"
          sx={{flexDirection: 'row', alignItems: 'baseline', gap: 4}}
          onSubmit={handleOnSubmitForm}
        >
          <TextField
            id="stand-name"
            placeholder="نام استند"
            value={standName}
            variant="standard"
            onChange={handleOnStandName}
          />
          <TextField
            id="stand-ip"
            placeholder="شماره آی پی"
            value={ipNumString}
            variant="standard"
            onChange={handleOnIpNumString}
          />

          <Button
            variant="contained"
            sx={{
              fontSize: '0.875rem',
            }}
            color="success"
            type="submit"
            endIcon={<AddIcon />}
          >
            افزودن استند
          </Button>
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
