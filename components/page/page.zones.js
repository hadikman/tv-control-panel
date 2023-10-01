import * as React from 'react'
import {Form, ZonesCard} from 'components/UI'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import {zones} from 'util/dummy-data'

function ZonesPage({...props}) {
  const [name, setName] = React.useState('')

  function handleInput(e) {
    setName(e.target.value)
  }

  function handleFormSubmit(e) {
    e.preventDefault()

    // TODO send a POST request to the API
    console.log({name, slug: '/zone-n'})

    setName('')
  }

  return (
    <Box {...props}>
      <Box sx={{mb: 1, py: 3}}>
        <Form
          sx={{flexDirection: 'row', alignItems: 'baseline', gap: 4}}
          onSubmit={handleFormSubmit}
        >
          <TextField
            id="add-zone"
            placeholder="نام زون جدید"
            value={name}
            helperText="فضای رزرو پیغام خطا"
            variant="standard"
            onChange={handleInput}
          />

          <Button
            variant="contained"
            sx={{
              fontSize: '0.875rem',
            }}
            color="accentClr"
            type="submit"
          >
            افزودن
          </Button>
        </Form>
      </Box>

      <Divider />

      <Grid
        sx={{
          height: 472,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          alignContent: 'center',
          gap: 3,
          py: 3,
          overflowY: 'auto',
        }}
      >
        {zones.map(({id, ...props}) => (
          <Box key={id} sx={{width: '100%'}}>
            <ZonesCard {...props} />
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

export default ZonesPage
