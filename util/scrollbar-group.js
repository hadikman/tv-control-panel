export const customVerticalScrollbar = {
  '&::-webkit-scrollbar': {
    width: '0.55rem',
  },
  '&::-webkit-scrollbar-track': {
    bgcolor: 'lightClr.main',
    p: 1,
    borderRadius: '10rem',
  },
  '&::-webkit-scrollbar-thumb': {
    width: '8rem',
    bgcolor: 'hsl(0 0% 55%)',
    border: 'thin solid',
    borderColor: 'hsl(0 0% 35%)',
    borderRadius: '10rem',
    ':hover': {
      bgcolor: 'hsl(0 0% 35%)',
    },
  },
}

export const customHorizontalScrollbar = {
  '&::-webkit-scrollbar': {
    height: '0.45rem',
  },
  '&::-webkit-scrollbar-track': {
    bgcolor: 'darkClr.main',
    p: 1,
    borderRadius: '10rem',
  },
  '&::-webkit-scrollbar-thumb': {
    width: '8rem',
    bgcolor: 'hsl(0 0% 45%)',
    border: 'thin solid',
    borderColor: 'hsl(0 0% 65%)',
    borderRadius: '10rem',
    ':hover': {
      bgcolor: 'hsl(0 0% 65%)',
    },
  },
}
