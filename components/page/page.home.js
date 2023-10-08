import * as React from 'react'
import {useQuery} from '@tanstack/react-query'
import {GaugeMeter} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import {serverStateArr, overallState} from 'util/dummy-data'
import {fetchAndPostData} from 'util/helper-functions'
import {SERVER_STATUS_API} from 'util/api-url'

const URL = process.env.NEXT_PUBLIC_DOMAIN + SERVER_STATUS_API

function HomePage({...props}) {
  const {data, isLoading, isSuccess} = useQuery({
    queryKey: ['server-status'],
    queryFn: () => fetchAndPostData(URL),
  })

  let serverStatusSkeletonComponents = []
  let serverStatusComponents = []

  const aliasNames = {cpu: 'سی پی یو', memory: 'حافظه رم', disk: 'هارددیسک'}

  serverStatusSkeletonComponents = (
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
      {[1, 2, 3].map(item => (
        <Skeleton key={item} variant="rounded" width="100%" height={270} />
      ))}
    </Grid>
  )

  if (isSuccess) {
    for (const key in data.data) {
      const element = data.data[key]

      const Item = (
        <Grid key={key} item sx={{position: 'relative'}}>
          <GaugeMeter speed={element.usage} />

          <Stack
            sx={{
              gap: 1,
              bgcolor: 'secondary.main',
              color: 'secondary.contrastText',
              borderRadius: 'var(--sm-corner)',
              py: 2,
              px: 1,
              mt: 1,
            }}
          >
            {element.usage && (
              <Typography variant="body1">
                میزان استفاده : {element.usage}
              </Typography>
            )}
            {element.cores && (
              <Typography variant="body1">
                تعداد هسته ها : {element.cores}
              </Typography>
            )}
            {element.used && (
              <Typography variant="body1">
                مقدار استفاده شده : {element.used}
              </Typography>
            )}
            {element.free && (
              <Typography variant="body1">
                مقدار آزاد : {element.free}
              </Typography>
            )}
            {element.total && (
              <Typography variant="body1">مقدار کل : {element.free}</Typography>
            )}
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
              {aliasNames[key]}
            </Box>
          </Stack>
        </Grid>
      )

      serverStatusComponents.push(Item)
    }
  }

  return (
    <Box {...props}>
      <Box sx={{textAlign: 'center', mb: 5}}>
        <Grid container sx={{justifyContent: 'space-between', gap: 1}}>
          {isLoading ? serverStatusSkeletonComponents : serverStatusComponents}
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
        {overallState.map(({title, count}) => (
          <Grid key={title} item bgcolor="primary.main" xs={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {title} :
                </Typography>
                <Typography variant="h4" component="div">
                  {count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default HomePage
