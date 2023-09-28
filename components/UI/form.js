import Stack from '@mui/material/Stack'

function Form({children, ...props}) {
  return (
    <Stack component="form" {...props}>
      {children}
    </Stack>
  )
}

export {Form}
