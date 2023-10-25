import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

function Notification({
  open,
  onClose,
  isError,
  isSuccess,
  message,
  autoHideDuration = 6000,
}) {
  function handleCloseSnackbar(event, reason) {
    if (reason === 'clickaway') {
      return
    }

    if (onClose) {
      onClose('')
    }
  }

  return (
    <Snackbar
      open={open}
      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      onClose={handleCloseSnackbar}
      autoHideDuration={autoHideDuration}
      action={
        <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      {isError || isSuccess ? (
        <Alert
          onClose={handleCloseSnackbar}
          variant="filled"
          severity={(isError && 'error') || (isSuccess && 'success')}
          sx={{width: '100%'}}
        >
          {message}
        </Alert>
      ) : null}
    </Snackbar>
  )
}

export default Notification
