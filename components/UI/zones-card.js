import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'

function ZonesCard({name, videosCount, slug}) {
  const isLoading = false
  const videosThumbnail = videosCount
  const videosThumbnailCount = videosThumbnail.length
  const isEmptyZone = videosThumbnailCount === 0
  const DO_NOT_CHANGE_THIS_VALUE = 3
  const GRID_COLS = DO_NOT_CHANGE_THIS_VALUE
  const THUMBNAILS_IN_EACH_ROW = GRID_COLS + 1
  const THUMBNAILS_IN_SECOND_ROW = videosThumbnailCount - THUMBNAILS_IN_EACH_ROW
  const isMoreThanOneRow = videosThumbnailCount >= THUMBNAILS_IN_EACH_ROW

  const colSpanInFirstRow = isMoreThanOneRow
    ? GRID_COLS
    : 12 / videosThumbnailCount
  const colSpanInSecondRow = 12 / THUMBNAILS_IN_SECOND_ROW

  function handleAddZone() {
    console.log({name})
  }

  return (
    <Card
      sx={{
        '--card-height': '12.5rem',
        '--card-content-height': 'calc(var(--card-height) * 0.75)',
        '--card-name-height':
          'calc(var(--card-height) - var(--card-content-height))',
        height: 'var(--card-height)',
      }}
    >
      <CardContent sx={{height: 'var(--card-content-height)', p: 0}}>
        <Grid
          container
          sx={{
            height: '100%',
            bgcolor: 'darkClr.main',
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
            <IconButton color="accentClr" size="large" onClick={handleAddZone}>
              <AddIcon fontSize="large" />
            </IconButton>
          ) : (
            videosThumbnail.map((imgSrc, index) => {
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
        </Grid>
      </CardContent>
      <CardActions
        sx={{
          height: 'var(--card-name-height)',
          justifyContent: 'center',
          p: 0,
          '& > .link': {
            flexGrow: 1,
            textAlign: 'center',
            px: 1,
          },
        }}
      >
        {isEmptyZone ? (
          <Button size="small">{name}</Button>
        ) : (
          <Link className="link" href={`/zones/${slug}`}>
            <Button size="small">{name}</Button>
          </Link>
        )}
      </CardActions>
    </Card>
  )
}

export {ZonesCard}
