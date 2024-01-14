import {
  CssBaseline,
  GlobalStyles,
  IconButton,
  PaletteMode,
  PaletteOptions,
  ThemeProvider,
  createTheme,
  styled
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import { MaterialDesignContent, SnackbarProvider, closeSnackbar } from 'notistack'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import { LeagueOfLegendsPage } from './pages/LeagueOfLegendsPage'

function App(): JSX.Element {
  const [mode, setMode] = useState<PaletteMode>('dark')
  const queryClient = new QueryClient()

  const toggleColorMode = (): void => {
    setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const primaryLight = {
    light: '#757ce8',
    main: '#3f50b5',
    dark: '#002884',
    contrastText: '#fff'
  }

  const secondaryLight = {
    light: '#FFFFFF',
    main: '#FFFFFF',
    dark: '#00a152',
    contrastText: '#000'
  }

  const secondaryDark = {
    light: '#1c1b1b',
    main: '#FFFFFF',
    dark: '#121212',
    contrastText: '#000'
  }

  const getDesignTokens = (mode: PaletteMode): PaletteOptions => {
    const palette = {
      mode,
      ...(mode === 'light'
        ? {
            primary: primaryLight,
            secondary: secondaryLight
            // custom light mode palette here
          }
        : {
            // custom dark mode palette here
            secondary: secondaryDark
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
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: mode === 'dark' ? secondaryDark.light : secondaryLight.light
          }
        }
      }
    }
  })

  const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
    '&.notistack-MuiContent-success': {
      color: '#2e2d2d',
      fontSize: '16px'
    },
    '&.notistack-MuiContent-error': {
      color: '#2e2d2d',
      fontSize: '16px'
    },
    '&.notistack-MuiContent-info': {
      color: '#2e2d2d',
      fontSize: '16px'
    }
  }))

  return (
    <SnackbarProvider
      autoHideDuration={5000}
      preventDuplicate={true}
      Components={{
        success: StyledMaterialDesignContent,
        error: StyledMaterialDesignContent,
        info: StyledMaterialDesignContent
      }}
      action={(snackbarId): JSX.Element => (
        <IconButton onClick={(): void => closeSnackbar(snackbarId)}>
          <CloseIcon sx={{ height: '20px' }}></CloseIcon>
        </IconButton>
      )}
    >
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            '*::-webkit-scrollbar': {
              width: '0.4em'
            },
            '*::-webkit-scrollbar-track': {
              margin: '10px'
            },
            '*::-webkit-scrollbar-thumb': {
              background: '#393959',
              borderRadius: '8px'
            }
          }}
        ></GlobalStyles>
        <CssBaseline />
        <HashRouter>
          <Header toggleDarkmode={toggleColorMode}></Header>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/" Component={HomePage}></Route>
              <Route path="/home" element={<HomePage />}></Route>
              <Route path="/lol" Component={LeagueOfLegendsPage}></Route>
            </Routes>
          </QueryClientProvider>
        </HashRouter>
      </ThemeProvider>
    </SnackbarProvider>
  )
}

export default App
