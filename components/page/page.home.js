import * as React from 'react'
import {GaugeMeter} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {serverStateArr, overallState} from 'util/dummy-data'

function HomePage({...props}) {
  return (
    <Box {...props}>
      <Box sx={{textAlign: 'center', mb: 5}}>
        <Grid container sx={{justifyContent: 'space-between', gap: 1}}>
          {serverStateArr.map(({device, performanceSpeed}) => (
            <Grid key={device} item>
              <GaugeMeter speed={performanceSpeed} />

              <Grid
                container
                sx={{
                  justifyContent: 'center',
                  alignItems: 'baseline',
                  gap: 1,
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                  borderRadius: 'var(--sm-corner)',
                  py: 2,
                  px: 1,
                  mt: 1,
                }}
              >
                <Typography variant="h6">{device}</Typography>
                <Typography variant="h5">:</Typography>
                <Typography variant="h5">{performanceSpeed}</Typography>
              </Grid>
            </Grid>
          ))}
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
