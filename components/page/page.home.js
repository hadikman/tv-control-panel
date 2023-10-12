import * as React from 'react'
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
import {fetchAndPostData, generateListOfIndex} from 'util/helper-functions'
import {SERVER_STATUS_API} from 'util/api-url'

const URL = process.env.NEXT_PUBLIC_DOMAIN + SERVER_STATUS_API

export default function HomePage({...props}) {
  const {data, isLoading, isSuccess} = useQuery({
    queryKey: ['server-status'],
    queryFn: () => fetchAndPostData(URL),
  })

  let serverStatus = []
  let overallStatus = []

  if (isSuccess) {
    serverStatus = data.data.serverStatus
    overallStatus = data.data.overallStatus
  }

  return (
    <Box {...props}>
      <Box sx={{textAlign: 'center', mb: 5}}>
        <Grid container sx={{justifyContent: 'space-between', gap: 1}}>
          {isLoading ? (
            <SkeletonsGroup count={3} width="100%" height={260} />
          ) : (
            serverStatus.map(({hardware, usage = 14, additionalStatus}) => (
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
                      top: '45%',
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
          )}
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
          <SkeletonsGroup count={3} width="100%" height={160} />
        ) : (
          overallStatus.map(({statusName, value}) => (
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
        )}
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
