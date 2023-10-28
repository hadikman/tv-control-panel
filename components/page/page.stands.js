import * as React from 'react'
import useQueryData from 'hook/useQueryData'
import useMutateData from 'hook/useMutateData'
import {GET_ALL_STANDS_API, EDIT_STAND_API} from 'util/api-url'
import StandCard from 'components/UI/stand-card'
import Notification from 'components/UI/notification'
import useClickOutsideElement from 'hook/useClickOutsideElement'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import EditIcon from '@mui/icons-material/Edit'
import DoneIcon from '@mui/icons-material/Done'
import {customVerticalScrollbar} from 'util/scrollbar-group'

export default function StandsPage() {
  const {data, isLoading, isSuccess} = useQueryData({
    queryKey: ['all-stands-data'],
    url: GET_ALL_STANDS_API,
  })
  const {mutate: mutateToRenameStand, isSuccess: isRenamedSuccessfully} =
    useMutateData({
      queryKey: ['all-stands-data'],
      url: EDIT_STAND_API,
    })
  // const {mutate: mutateToDeleteStand, isSuccess: isDeletedSuccessfully} =
  //   useMutateData({
  //     queryKey: ['all-stands-data'],
  //     url: DELETE_STAND_API,
  //   })
  const [editStandId, setEditStandId] = React.useState()
  const [status, setStatus] = React.useState('')

  let stands = []
  let isEmptyStand

  // const isRenameStand = editStandId
  const isRenamedStand = status === 'renamed'
  const isDeletedStand = status === 'deleted'
  const isSuccessStatus = isRenamedStand || isDeletedStand

  const statusMsg = isDeletedStand
    ? 'استند با موفقیت حذف گردید'
    : isRenamedStand
    ? 'نام استند با موفقیت تغییر یافت'
    : ''

  if (isSuccess) {
    if (data.success) {
      stands = data.data
      isEmptyStand = stands.length === 0
    }
  }

  React.useEffect(() => {
    if (isRenamedSuccessfully) {
      setStatus('renamed')
    }
  }, [isRenamedSuccessfully])

  // React.useEffect(() => {
  //   if (isDeletedSuccessfully) {
  //     setStatus('deleted')
  //   }
  // }, [isDeletedSuccessfully])

  function handleOnOpenEditStandName(id) {
    setEditStandId(id)
  }

  function handleOnRenameStand(standID, newName) {
    mutateToRenameStand({standID, name: newName})
  }

  // function handleOnDeleteStand(standID, name) {
  //   const isConfirmed = confirm(`آیا استند "${name}" حذف شود؟`)

  // if (isConfirmed) {
  //   mutateToDeleteStand({zoneID: +q, standID, name})
  // }
  // }

  return (
    <Box
      sx={{bgcolor: 'hsl(0 0% 88%)', borderRadius: 'var(--sm-corner)', p: 2}}
    >
      <Grid
        container
        spacing={1}
        sx={{
          height: 560,
          alignContent: 'flex-start',
          textAlign: 'center',
          p: 1,
          overflowY: 'auto',
          ...customVerticalScrollbar,
        }}
      >
        {isLoading ? (
          [1, 2].map(item => (
            <Grid key={item} item xs="auto">
              <Skeleton variant="rounded" width={140} height={120} />
            </Grid>
          ))
        ) : isEmptyStand ? (
          <Grid item xs>
            <Typography variant="body2">
              در حال حاظر لیست استندها خالی می‌باشد.
            </Typography>
          </Grid>
        ) : (
          stands.map(({id, name, ...props}) => (
            <Grid key={id} item xs="auto" sx={{position: 'relative'}}>
              <StandCard name={name} {...props}>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => handleOnOpenEditStandName(id)}
                >
                  <EditIcon />
                </Button>
              </StandCard>

              {editStandId === id && (
                <RenameStand
                  standId={id}
                  updateFn={handleOnRenameStand}
                  closeFn={setEditStandId}
                />
              )}
            </Grid>
          ))
        )}
      </Grid>

      <Notification
        open={isSuccessStatus}
        onClose={setStatus}
        isSuccess={isSuccessStatus}
        message={statusMsg}
        autoHideDuration={3000}
      />
    </Box>
  )
}

function RenameStand({standId, updateFn, closeFn}) {
  const [newName, setNewName] = React.useState('')
  const {ref: clickOutsideElRef} = useClickOutsideElement(closeFn)

  function handleOnChangeStandName(event) {
    const name = event.target.value

    setNewName(name)
  }

  function handleOnSubmitEditStandName(event) {
    event.preventDefault()

    updateFn(standId, newName)
    closeFn(false)
  }

  return (
    <Box
      component="form"
      sx={{
        position: 'absolute',
        top: '0',
        left: '53%',
        transform: 'translateX(-50%)',
        width: '110%',
        bgcolor: 'lightClr.main',
        border: '1px solid',
        borderColor: 'info.light',
        borderRadius: 'var(--sm-corner)',
        p: 1,
        boxShadow: '0 6px 12px 2px hsl(0 0% 0% / 0.2)',
        zIndex: 10,
        input: {
          '&::placeholder': {fontSize: '0.75em'},
        },
      }}
      onSubmit={handleOnSubmitEditStandName}
      ref={clickOutsideElRef}
    >
      <Grid
        sx={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.85rem',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            borderRadius: 'var(--sm-corner)',
            p: '4px',
            ':hover': {
              bgcolor: 'hsl(0 0% 90%)',
            },
          }}
        >
          <InputBase
            id="newStandName"
            type="text"
            autoFocus
            value={newName}
            placeholder="نام جدید"
            onChange={handleOnChangeStandName}
          />
        </Box>

        <Button type="submit" sx={{minWidth: 'unset', fontSize: '6px'}}>
          <DoneIcon />
        </Button>
      </Grid>
    </Box>
  )
}
