import { CssBaseline, PaletteMode, PaletteOptions, ThemeProvider, createTheme } from '@mui/material'

import { useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import { LeagueOfLegendsPage } from './pages/LeagueOfLegendsPage'
import { QueryClient, QueryClientProvider } from 'react-query'

function App(): JSX.Element {
  const [mode, setMode] = useState<PaletteMode>('dark')
  const queryClient = new QueryClient()

  const toggleColorMode = (): void => {
    setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const getDesignTokens = (mode: PaletteMode): PaletteOptions => {
    const palette = {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              light: '#757ce8',
              main: '#3f50b5',
              dark: '#002884',
              contrastText: '#fff'
            },
            secondary: {
              light: '#33eb91',
              main: '#00e676',
              dark: '#00a152',
              contrastText: '#000'
            }
            // custom light mode palette here
          }
        : {
            // custom dark mode palette here
            secondary: {
              light: '#33eb91',
              main: '#00e676',
              dark: '#00a152',
              contrastText: '#000'
            }
          })
    } as PaletteOptions

    return palette
  }

  const theme = createTheme({
    typography: {
      button: {
        textTransform: 'none'
      }
    },
    palette: { ...getDesignTokens(mode), ...{} },
    components: {
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: 'white'
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: 'white'
          }
        }
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <QueryClientProvider client={queryClient}>
          <Header toggleDarkmode={toggleColorMode}></Header>
          <Routes>
            <Route path="/" Component={HomePage}></Route>
            <Route path="/home" element={<HomePage />}></Route>
            <Route path="/lol" Component={LeagueOfLegendsPage}></Route>
          </Routes>
        </QueryClientProvider>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
