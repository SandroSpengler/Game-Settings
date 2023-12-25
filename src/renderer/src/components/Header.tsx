import {
  AppBar,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'

import Brightness4Icon from '@mui/icons-material/Brightness4'
import MenuIcon from '@mui/icons-material/Menu'
import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { ReactComponent as LinuxIcon } from '../assets/Logo/Linux.svg'
import { ReactComponent as AppleIcon } from '../assets/Logo/Mac.svg'
import { ReactComponent as WindowsIcon } from '../assets/Logo/Windows.svg'

import ProcessHandler from '@renderer/types/ProcessHandler'

interface HeaderProps {
  toggleDarkmode: () => void
}

const Header = (props: HeaderProps): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [osPlatform, setOsPlatform] = useState<NodeJS.Platform | undefined>()

  const ProcessHandler = window.ProcessHandler as ProcessHandler

  const navigate = useNavigate()

  useEffect(() => {
    loadOSInformation()
  }, [])

  const loadOSInformation = async (): Promise<void> => {
    const osInfo = await ProcessHandler.getOsInformation()

    setOsPlatform(osInfo.platform)
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar
          disableGutters={true}
          sx={{ display: 'flex', justifyContent: 'space-between', padding: 0 }}
        >
          <Box>
            <Tabs
              value={selectedTab}
              variant="standard"
              aria-label="basic tabs example"
              textColor="secondary"
              onChange={(event, value): void => {
                event.preventDefault()
                setSelectedTab(value)

                switch (value) {
                  case 0:
                    navigate('home')
                    break
                  case 1:
                    navigate('lol')
                    break
                }
              }}
            >
              <Tab label={<Typography variant="h6">Home</Typography>} />
              <Tab label={<Typography variant="h6">League of Legends</Typography>} />
            </Tabs>
          </Box>

          <Stack direction="row" alignItems="center" gap={3}>
            {!osPlatform && null}

            {osPlatform === 'win32' && (
              <SvgIcon
                viewBox="0 0 88 88"
                component={WindowsIcon}
                style={{ margin: '0 10 0 0' }}
              ></SvgIcon>
            )}

            {osPlatform === 'linux' && (
              <SvgIcon
                viewBox="0 2 48 48"
                component={LinuxIcon}
                style={{ margin: '0 10 0 0' }}
              ></SvgIcon>
            )}

            {osPlatform === 'darwin' && (
              <SvgIcon
                viewBox="0 0 256 256"
                component={AppleIcon}
                style={{ margin: '0 10 0 0' }}
              ></SvgIcon>
            )}

            <div>
              <Tooltip title="Toggle between light and darkmode">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={props.toggleDarkmode}
                >
                  <Brightness4Icon />
                </IconButton>
              </Tooltip>
            </div>

            <IconButton size="large" edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header
