import * as React from 'react'
import {useRouter} from 'next/router'
import useQueryData from 'hook/useQueryData'
import useMutateData from 'hook/useMutateData'
import {
  GET_ALL_STANDS_API,
  GET_ZONE_STANDS_API,
  SAVE_ZONE_STANDS_API,
} from 'util/api-url'
import FilesAndTimeline from 'components/UI/files-timeline'
import StandCard from 'components/UI/stand-card'
import SendButton from 'components/UI/send-button'
import Notification from 'components/UI/notification'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Skeleton from '@mui/material/Skeleton'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import SaveIcon from '@mui/icons-material/Save'
import {customVerticalScrollbar} from 'util/scrollbar-group'
import VAZIRMATN_FONT from 'util/share-font'

export default function Zone() {
  const router = useRouter()
  const {q} = router.query
  const isQueryParam = q !== undefined
  const {
    data: allStandsData,
    isLoading: isLoadingAllStands,
    isSuccess: isSuccessAllStands,
  } = useQueryData({
    queryKey: ['all-stands-data'],
    url: GET_ALL_STANDS_API,
    enabled: isQueryParam,
  })
  const {
    data: standsData,
    isLoading: isLoadingStandsData,
    isSuccess: isSuccessStandsData,
  } = useQueryData({
    queryKey: ['stands-data', q],
    url: GET_ZONE_STANDS_API,
    body: {zoneID: +q},
    enabled: isQueryParam,
  })
  const {
    mutate: mutateToSaveStands,
    isLoading: isSending,
    isSuccess: isSavedSuccessfully,
  } = useMutateData({
    queryKey: ['stands-data', q],
    url: SAVE_ZONE_STANDS_API,
  })

  const [freeStands, setFreeStands] = React.useState([])
  const [addedStands, setAddedStands] = React.useState([])
  const [openModal, setOpenModal] = React.useState(false)
  const [status, setStatus] = React.useState('')

  let totalStands = 0

  let isEmptyAllStands = false
  const isEmptyAddedStands = false
  const isSavedStands = status === 'saved'

  const statusMsg = isSavedStands ? 'تغییرات با موفقیت ذخیره گردید' : ''

  if (isSuccessStandsData) {
    if (standsData.success) {
      totalStands = standsData.data.length
    }
  }

  React.useEffect(() => {
    if (isSuccessAllStands) {
      const freeAllStandsData = allStandsData.data.filter(
        stand => stand.zone === null,
      )

      setFreeStands(freeAllStandsData)
    }
  }, [isSuccessAllStands, allStandsData])

  React.useEffect(() => {
    if (isSuccessStandsData) {
      setAddedStands(standsData.data)
    }
  }, [isSuccessStandsData, standsData])

  React.useEffect(() => {
    if (isSavedSuccessfully) {
      setStatus('saved')
    }
  }, [isSavedSuccessfully])

  function handlOpenStandsManagementModal() {
    setOpenModal(true)
  }

  function handleCloseStandsManagementModal() {
    setOpenModal(false)
  }

  function handleOnAddStand(addedStand) {
    const isExist = addedStands.some(stand => stand.id === addedStand.id)

    if (!isExist) {
      setAddedStands(prevState => [...prevState, addedStand])
      setFreeStands(prevState =>
        prevState.filter(stand => stand.id !== addedStand.id),
      )
    }
  }

  function handleOnRemoveStand(standData) {
    setAddedStands(prevState =>
      prevState.filter(stand => stand.id !== standData.id),
    )
    setFreeStands(prevState =>
      [...prevState, standData].sort((a, b) => a.id - b.id),
    )
  }

  function handleOnSaveAddedStands() {
    const standsID = addedStands.map(stand => stand.id)
    const newAddedStandsData = {zoneID: +q, stands: standsID}

    mutateToSaveStands(newAddedStandsData)
  }

  return (
    <Box>
      <Box sx={{mb: 2}}>
        <Button variant="contained" onClick={handlOpenStandsManagementModal}>
          مدیریت استندها
        </Button>

        <Modal
          className={VAZIRMATN_FONT.className}
          open={openModal}
          onClose={handleCloseStandsManagementModal}
        >
          <Box
            sx={{
              width: '95%',
              maxWidth: '1200px',
              bgcolor: 'lightClr.main',
              p: 2,
              mt: 7,
              mx: 'auto',
            }}
          >
            <Grid container spacing={1} sx={{'--inline-gap': '16px'}}>
              <Grid item xs={4}>
                <Stack spacing={1}>
                  <Grid
                    container
                    sx={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 'var(--inline-gap)',
                      border: 'thin solid',
                      borderColor: 'hsl(0 0% 80%)',
                      borderRadius: 'var(--sm-corner)',
                      py: 1,
                      px: 'var(--inline-gap)',
                    }}
                  >
                    <Grid item>
                      <Typography variant="body2">
                        کل استندهای متصل: <strong>{totalStands}</strong>
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box
                    sx={{
                      border: 'thin solid',
                      borderColor: 'hsl(0 0% 80%)',
                      borderRadius: 'var(--sm-corner)',
                      overflowY: 'auto',
                      ...customVerticalScrollbar,
                    }}
                  >
                    <Grid
                      container
                      spacing={1}
                      sx={{
                        height: '470px',
                        alignContent: 'flex-start',
                        textAlign: 'center',
                        p: 1,
                      }}
                    >
                      {isLoadingAllStands ? (
                        [1, 2].map(item => (
                          <Grid key={item} item xs="auto">
                            <Skeleton
                              variant="rounded"
                              width={72}
                              height={72}
                            />
                          </Grid>
                        ))
                      ) : isEmptyAllStands ? (
                        <Grid item xs>
                          <Typography variant="body2">
                            در حال حاظر استندی برای افزودن موجود نیست.
                          </Typography>
                        </Grid>
                      ) : (
                        freeStands.map(({id, name, ...props}) => (
                          <Grid key={id} item xs="auto">
                            <StandCard name={name}>
                              <Button
                                size="small"
                                color="primary"
                                onClick={() =>
                                  handleOnAddStand({id, name, ...props})
                                }
                              >
                                <AddIcon />
                              </Button>
                            </StandCard>
                          </Grid>
                        ))
                      )}
                    </Grid>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={8}>
                <Grid
                  container
                  sx={{
                    flexDirection: 'column',
                    border: 'thin solid',
                    borderColor: 'hsl(0 0% 80%)',
                    borderRadius: 'var(--sm-corner)',
                    p: 1.5,
                  }}
                >
                  <Grid
                    container
                    spacing={1}
                    sx={{
                      alignContent: 'flex-start',
                      height: '455px',
                      textAlign: isEmptyAddedStands ? 'left' : 'center',
                      pl: 0.75,
                      pb: 1,
                      overflowY: 'auto',
                      ...customVerticalScrollbar,
                    }}
                  >
                    {isLoadingStandsData ? (
                      [1, 2].map(item => (
                        <Grid key={item} item xs="auto">
                          <Skeleton variant="rounded" width={72} height={72} />
                        </Grid>
                      ))
                    ) : isEmptyAddedStands ? (
                      <Grid item xs>
                        <Typography variant="body2">
                          حداقل یک استند از کادر سمت راست اضافه نمایید.
                        </Typography>
                      </Grid>
                    ) : (
                      addedStands.map(({id, name, ...props}) => (
                        <Grid key={id} item xs="auto">
                          <StandCard name={name} {...props}>
                            <Button
                              size="small"
                              color="error"
                              onClick={() =>
                                handleOnRemoveStand({id, name, ...props})
                              }
                            >
                              <ClearIcon />
                            </Button>
                          </StandCard>
                        </Grid>
                      ))
                    )}
                  </Grid>

                  <Box sx={{mt: 'auto'}}>
                    <SendButton
                      lableText="ذخیره"
                      isSending={isSending}
                      isSuccess={isSavedSuccessfully}
                      iconCmp={<SaveIcon />}
                      onClick={handleOnSaveAddedStands}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </Box>

      <Divider />

      <Box
        sx={{
          maxHeight: '30rem',
          overflowY: 'auto',
          pr: 1,
          ...customVerticalScrollbar,
        }}
      >
        <Divider />

        <Box sx={{mt: 2}}>
          <FilesAndTimeline />
        </Box>
      </Box>

      <Notification
        open={isSavedStands}
        onClose={setStatus}
        isSuccess={isSavedStands}
        message={statusMsg}
        autoHideDuration={3000}
      />
    </Box>
  )
}
