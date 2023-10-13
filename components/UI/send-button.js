import * as React from 'react'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/Add'
import DoneIcon from '@mui/icons-material/Done'
import {preventClicking} from 'util/helper-functions'

function SendButton({
  lableText,
  isSending,
  isSent,
  iconCmp,
  sx,
  onClick,
  ...props
}) {
  const [isAddedZoneName, setIsAddedZoneName] = React.useState(false)
  const SUCCESSFUL_DISPLAY_TIME_DURATION = 2000

  React.useEffect(() => {
    let timeout

    if (isSent) {
      setIsAddedZoneName(true)

      timeout = setTimeout(() => {
        setIsAddedZoneName(false)
      }, SUCCESSFUL_DISPLAY_TIME_DURATION)
    }

    return () => clearTimeout(timeout)
  }, [isSent])

  return (
    <Button
      type="submit"
      variant="contained"
      endIcon={
        isSending ? (
          <CircularProgress size={18} />
        ) : isAddedZoneName ? (
          <DoneIcon />
        ) : (
          iconCmp || <AddIcon />
        )
      }
      disabled={isSending ? true : false}
      color={isAddedZoneName ? 'success' : 'secondary'}
      sx={{...sx}}
      onClick={isAddedZoneName ? preventClicking : onClick}
      {...props}
    >
      {isAddedZoneName ? 'ثبت شد' : lableText}
    </Button>
  )
}

export {SendButton}
