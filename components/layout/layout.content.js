import Container from '@mui/material/Container'

function Content({children, ...props}) {
  return (
    <Container
      component="section"
      maxWidth="false"
      sx={{
        bgcolor: 'lightClr.main',
        borderRadius: 'var(--sm-corner)',
        py: 2,
      }}
      {...props}
    >
      {children}
    </Container>
  )
}

export default Content
