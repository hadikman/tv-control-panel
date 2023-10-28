import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

function StandCard({name, ip, mac, online = true, children}) {
  const isIp = ip
  const isMac = mac

  return (
    <Paper
      variant={online ? 'elevation' : 'outlined'}
      elevation={5}
      sx={{
        minWidth: isIp ? 140 : 72,
        width: isIp ? 140 : 72,
        bgcolor: 'hsl(0 0% 90%)',
        p: isIp ? 1 : 0.5,
      }}
    >
      <Box sx={{mb: 1}}>
        <Typography variant="body2" sx={{fontWeight: 700}}>
          {name}
        </Typography>
        {isIp && <Typography variant="body2">{ip}</Typography>}
        {isMac && <Typography variant="body2">{mac}</Typography>}
      </Box>

      {children}
    </Paper>
  )
}

export default StandCard
