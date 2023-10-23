import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import ClearIcon from '@mui/icons-material/Clear'
import PermMediaIcon from '@mui/icons-material/PermMedia'

function ZoneCard({id, name, stands, thumbnails = [], deleteZoneFn}) {
  const isLoading = false
  const standsCount = stands.length
  const filesThumbnail = [...thumbnails]
  const filesThumbnailCount = filesThumbnail.length
  const isEmptyZone = filesThumbnailCount === 0
  const DO_NOT_CHANGE_THIS_VALUE = 3
  const GRID_COLS = DO_NOT_CHANGE_THIS_VALUE
  const THUMBNAILS_IN_EACH_ROW = GRID_COLS + 1
  const THUMBNAILS_IN_SECOND_ROW = filesThumbnailCount - THUMBNAILS_IN_EACH_ROW
  const isMoreThanOneRow = filesThumbnailCount >= THUMBNAILS_IN_EACH_ROW

  const colSpanInFirstRow = isMoreThanOneRow
    ? GRID_COLS
    : 12 / filesThumbnailCount
  const colSpanInSecondRow = 12 / THUMBNAILS_IN_SECOND_ROW

  return (
    <Card
      sx={{
        '--card-height': '13rem',
        '--card-content-height': 'calc(var(--card-height) * 0.75)',
        '--card-name-height':
          'calc(var(--card-height) - var(--card-content-height))',
        height: 'var(--card-height)',
        position: 'relative',
      }}
    >
      <CardContent sx={{height: 'var(--card-content-height)', p: 0}}>
        <Grid
          container
          sx={{
            height: '100%',
            bgcolor: 'hsl(0 0% 25%)',
            border: '3px solid',
            borderColor: 'darkClr.main',
            position: 'relative',
            ...(isLoading ||
              (isEmptyZone && {
                justifyContent: 'center',
                alignItems: 'center',
              })),
          }}
        >
          {isLoading ? (
            <CircularProgress color="accentClr" />
          ) : isEmptyZone ? (
            <PermMediaIcon fontSize="large" color="alternativeClr" />
          ) : (
            filesThumbnail.map((imgSrc, index) => {
              const count = index + 1

              return (
                <Grid
                  item
                  key={count}
                  xs={
                    count <= THUMBNAILS_IN_EACH_ROW
                      ? colSpanInFirstRow
                      : colSpanInSecondRow
                  }
                  sx={{
                    border: '1px solid',
                    borderColor: 'lightClr.main',
                    position: 'relative',
                  }}
                >
                  <Image
                    src={`/zone-thumbnails/${imgSrc}.jpg`}
                    alt="عکس بند انگشتی"
                    fill
                    sizes='sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"'
                    style={{objectFit: 'cover'}}
                  />
                </Grid>
              )
            })
          )}

          <Box sx={{position: 'absolute', bottom: 8, left: 8}}>
            <Typography
              variant="caption"
              color="lightClr.main"
            >{`تعداد استندها: ${standsCount}`}</Typography>
          </Box>
        </Grid>
      </CardContent>

      <CardActions
        sx={{
          height: 'var(--card-name-height)',
          justifyContent: 'center',
          alignItems: 'center',
          p: 0,
          '& > .link': {
            height: '100%',
            display: 'grid',
            alignContent: 'center',
            flexGrow: 1,
            textAlign: 'center',
            px: 1,
            transition: theme =>
              `${theme.transitions.create(['background-color'])}`,
            ':hover': {
              bgcolor: 'greyClr.main',
            },
          },
        }}
      >
        <Link className="link" href={`/zones/zone?q=${id}`}>
          {name}
        </Link>
      </CardActions>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bgcolor: 'error.main',
          borderBottomLeftRadius: '1rem',
        }}
      >
        <IconButton
          color=""
          fontSize="small"
          onClick={() => deleteZoneFn(id, name)}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  )
}

export {ZoneCard}
