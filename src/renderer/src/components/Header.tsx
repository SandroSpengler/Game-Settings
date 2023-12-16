import { AppBar, Box, IconButton, Stack, Tab, Tabs, Toolbar, Typography } from '@mui/material'

import Brightness4Icon from '@mui/icons-material/Brightness4'
import MenuIcon from '@mui/icons-material/Menu'
import Person2Icon from '@mui/icons-material/Person2'
import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  toggleDarkmode: () => void
}

const Header = (props: HeaderProps): JSX.Element => {
  const [selectedTab, setSelectedTab] = useState<number>(0)

  const navigate = useNavigate()

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
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={props.toggleDarkmode}
            >
              <Brightness4Icon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton edge="start" color="inherit" aria-label="btnProfile">
                <Person2Icon />
              </IconButton>
              <Typography variant="h6"></Typography>
            </Box>
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
