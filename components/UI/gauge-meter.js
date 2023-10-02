import Box from '@mui/material/Box'

function GaugeMeter({speed = -1}) {
  const gaugeMeterDivider = [...Array.from({length: 19}, (_, i) => i + 1)]
  const MAXIMUM_SPEED = 17.5
  const convertedSpeedToPercent = speed / 100
  const variableAngle = MAXIMUM_SPEED * convertedSpeedToPercent

  return (
    <Box
      sx={{
        '--container-width': '19.375rem',
        '--container-height': 'calc(var(--container-width) / 2)',
        '--gauge-meter-size': 'calc(var(--container-width) - 10px)',
        '--middle-dot-size': 'calc(var(--gauge-meter-size) * 0.15)',
        '--middle-surface-size': 'calc(var(--gauge-meter-size) * 0.83)',
        '--divider-base-degree': '-105deg',
        '--divider-thickness': '8px',
        '--divider-height': 'calc(var(--gauge-meter-size) - 20px)',
        '--bar-base-degree': '3deg',
        '--bar-thickness': 'calc(var(--gauge-meter-size) * 0.02)',
        '--bar-height': 'calc(var(--gauge-meter-size) * 0.37)',
        width: 'var(--container-width)',
        height: 'var(--container-height)',
        borderBottom: '1px solid',
        borderColor: 'darkClr.main',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: 'var(--gauge-meter-size)',
          height: 'var(--gauge-meter-size)',
          bgcolor: 'lightClr.main',
          border: '4px solid',
          borderColor: 'darkClr.main',
          borderRadius: '50%',
          mx: 'auto',
          position: 'relative',
          '.divider': {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'var(--divider-thickness)',
            height: 'var(--divider-height)',
            bgcolor: 'hsl(var(--bar-bgcolor) 100% 45%)',
            transform:
              'translate(-50%, -50%) rotate(calc(var(--divider-base-degree) + var(--divider-degree)))',
          },
        }}
      >
        <Box
          data-middle-dot
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'var(--middle-dot-size)',
            height: 'var(--middle-dot-size)',
            bgcolor: 'darkClr.main',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
          }}
        ></Box>
        {gaugeMeterDivider.map(i => (
          <Box
            data-gauge-bar-divider
            key={i}
            className="divider"
            sx={{
              '--bar-bgcolor': 120 - i * 6,
              '--divider-degree': `${i * 10}deg`,
            }}
          ></Box>
        ))}
        <Box
          data-hide-middle-surface
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 'var(--middle-surface-size)',
            height: 'var(--middle-surface-size)',
            bgcolor: 'lightClr.main',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        ></Box>
        <Box
          data-bar-container
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '160px',
            height: '160px',
            transform: 'translate(-50%, -50%)',
            zIndex: 40,
          }}
        >
          <Box
            data-bar-wrapper
            sx={{
              '--bar-degree': `${variableAngle * 10}deg`,
              position: 'relative',
              width: '160px',
              height: '160px',
              transform:
                'rotate(calc(var(--bar-base-degree) + var(--bar-degree)))',
              transition: '0.8s ease-in-out',
            }}
          >
            <Box
              data-bar
              sx={{
                position: 'absolute',
                top: '50.3%',
                left: '85%',
                width: 'var(--bar-height)',
                height: 'var(--bar-thickness)',
                bgcolor: 'darkClr.main',
                borderRadius: '3px',
                transform: 'translate(-50%, -50%)',
              }}
            ></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export {GaugeMeter}
