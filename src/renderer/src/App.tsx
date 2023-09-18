import { Button, CssBaseline, PaletteMode, ThemeProvider, createTheme } from '@mui/material'

import WavingHandIcon from '@mui/icons-material/WavingHand'
import { amber, grey, deepOrange } from '@mui/material/colors'
import { useMemo, useState } from 'react'

function App(): JSX.Element {
  const [mode, setMode] = useState<PaletteMode>('light')
  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'))
      }
    }),
    []
  )

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Button
        variant="outlined"
        onClick={async () => {
          // const process = await window.ProcessHandler.launchProcess()
          colorMode.toggleColorMode()

          console.log(process)
        }}
      >
        <WavingHandIcon></WavingHandIcon>
        Launch Process
      </Button>
    </ThemeProvider>
  )
}

export default App

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // custom light mode palette here
        }
      : {
          // custom dark mode palette here
        })
  }
})
