import Grid from '@mui/material/Grid'
import {useDraggable} from '@dnd-kit/core'
import {CSS} from '@dnd-kit/utilities'

function Draggable({id, data, sx, children, ...props}) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id,
    data,
  })

  const sxStyles = {
    ...sx,
    transform: CSS.Translate.toString(transform),
  }

  return (
    <Grid
      item
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={sxStyles}
      {...props}
    >
      {children}
    </Grid>
  )
}

export {Draggable}
