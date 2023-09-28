import {createTheme, ThemeProvider} from '@mui/material/styles'

let theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: `var(--ff-400)`,
  },
  palette: {
    primary: {main: 'hsl(210, 64%, 31%)'},
    secondary: {main: 'hsl(199, 100%, 42%)'},
  },
})

theme = createTheme(theme, {
  palette: {
    accentClr: theme.palette.augmentColor({
      color: {
        main: 'hsl(13, 80%, 60%)',
      },
      name: 'accent',
    }),
    alternativeClr: theme.palette.augmentColor({
      color: {
        main: 'hsl(185, 45%, 76%)',
      },
      name: 'alternative',
    }),
    lightClr: {main: 'hsl(0, 0%, 95%)'},
    darkClr: {main: 'hsl(0, 0%, 13%)'},
    greyClr: {main: 'hsl(201, 12%, 55%)'},
  },
})

function CustomizedThemeProvider({children, ...props}) {
  return (
    <ThemeProvider theme={theme} {...props}>
      {children}
    </ThemeProvider>
  )
}

export default CustomizedThemeProvider
