import { ThemeProvider } from '@emotion/react'
import { RouteProps } from 'react-router-dom'
import { purpleTheme } from '.'
import { CssBaseline } from '@mui/material'

export const AppTheme = ({ children }:RouteProps ) => {
  return (
    <ThemeProvider theme={ purpleTheme }>
      <CssBaseline />
      { children }
    </ThemeProvider>
  )
}
