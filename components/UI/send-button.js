import * as React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/Add'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import DoneIcon from '@mui/icons-material/Done'
import {preventClicking} from 'util/helper-functions'

function SendButton({
  lableText,
  isSending,
  isError,
  isSuccess,
  sendLabelText = 'در حال ارسال',
  errorLabelText = 'ارسال نشد',
  successLabelText = 'ارسال گردید',
  iconCmp,
  sx,
  onClick,
  ...props
}) {
  const [isSuccessState, setIsSuccessState] = React.useState(false)
  const DISPLAY_TIME_DURATION = 2000

  React.useEffect(() => {
    let timeout

    if (isSuccess) {
      setIsSuccessState(true)

      timeout = setTimeout(() => {
        setIsSuccessState(false)
      }, DISPLAY_TIME_DURATION)
    }

    return () => clearTimeout(timeout)
  }, [isSuccess])

  return (
    <Button
      type="submit"
      variant="contained"
      endIcon={
        isSending ? (
          <CircularProgress size={18} />
        ) : isError ? (
          <PriorityHighIcon />
        ) : isSuccessState ? (
          <DoneIcon />
        ) : (
          iconCmp || <AddIcon />
        )
      }
      disabled={isSending ? true : false}
      color={isError ? 'error' : isSuccessState ? 'success' : 'secondary'}
      sx={{...sx}}
      onClick={isError || isSuccessState ? preventClicking : onClick}
      {...props}
    >
      {isSending
        ? sendLabelText
        : isError
        ? errorLabelText
        : isSuccessState
        ? successLabelText
        : lableText}
    </Button>
  )
}

export default SendButton
