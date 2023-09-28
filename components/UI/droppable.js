import Grid from '@mui/material/Grid'
import {useDroppable} from '@dnd-kit/core'

function Droppable({id, data, sx, children, ...props}) {
  const {isOver, setNodeRef} = useDroppable({id, data})

  return (
    <Grid
      ref={setNodeRef}
      container
      sx={{...(isOver && {bgcolor: 'error.light'}), ...sx}}
      {...props}
    >
      {children}
    </Grid>
  )
}

export {Droppable}
