import * as React from 'react'
import axiosClient from 'util/axios-http'
import {SERVER_STATUS_API} from 'util/api-url'
import {useQuery} from '@tanstack/react-query'
import {GaugeMeter} from 'components/UI'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import {generateListOfIndex} from 'util/helper-functions'
import {customVerticalScrollbar} from 'util/scrollbar-group'

export default function HomePage({...props}) {
  const {data, isLoading, isSuccess} = useQuery({
    queryKey: ['server-status'],
    queryFn: () => axiosClient.post(SERVER_STATUS_API).then(res => res.data),
  })

  let serverStatusData = []
  let overallStatusData = []

  if (isSuccess) {
    serverStatusData = data.data.serverStatus
    overallStatusData = data.data.overallStatus
  }

  return (
    <Box {...props}>
      <Box
        sx={{
          maxHeight: '25rem',
          textAlign: 'center',
          mb: 5,
          pr: 1,
          overflowY: 'auto',
          ...customVerticalScrollbar,
        }}
      >
        <Grid container sx={{justifyContent: 'space-between', gap: 1}}>
          {isLoading ? (
            <SkeletonsGroup count={3} width="100%" height={260} />
          ) : isSuccess ? (
            serverStatusData.map(({hardware, usage = 14, additionalStatus}) => (
              <Grid key={hardware} item sx={{position: 'relative'}}>
                <GaugeMeter speed={usage} />

                <Stack
                  sx={{
                    gap: 1,
                    bgcolor: 'secondary.main',
                    color: 'secondary.contrastText',
                    borderRadius: 'var(--sm-corner)',
                    py: 2,
                    px: 3,
                    mt: 1,
                  }}
                >
                  {additionalStatus.map(({statusName, value}) => (
                    <Box key={statusName} sx={{display: 'flex', gap: 1}}>
                      <Typography variant="body1">{statusName}</Typography>
                      {':'}
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  ))}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      bgcolor: 'secondary.main',
                      borderRadius: 'var(--sm-corner)',
                      p: 1,
                      zIndex: 40,
                    }}
                  >
                    {hardware}
                  </Box>
                </Stack>
              </Grid>
            ))
          ) : null}
        </Grid>

        <Box sx={{py: 3}}>
          <Typography variant="h4" sx={{fontWeight: 700}}>
            وضعیت سرور
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Grid
        container
        sx={{alignItems: 'center', justifyContent: 'space-around', mt: 3}}
      >
        {isLoading ? (
          <SkeletonsGroup count={3} width="100%" height={130} />
        ) : isSuccess ? (
          overallStatusData.map(({statusName, value}) => (
            <Grid key={statusName} item bgcolor="primary.main" xs={3}>
              <Card>
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {statusName} :
                  </Typography>
                  <Typography variant="h4" component="div">
                    {value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : null}
      </Grid>
    </Box>
  )
}

function SkeletonsGroup({count = 3, width = '100%', height = 200}) {
  const generatedListOfIndex = generateListOfIndex(count)

  return (
    <Grid
      item
      xs={12}
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: '1fr',
        gap: 1,
      }}
    >
      {generatedListOfIndex.map(item => (
        <Skeleton key={item} variant="rounded" width={width} height={height} />
      ))}
    </Grid>
  )
}
