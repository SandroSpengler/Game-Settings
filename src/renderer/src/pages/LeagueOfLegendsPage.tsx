import CloseIcon from '@mui/icons-material/Close'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import { Box, Grid, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'

import SvgIcon from '@mui/material/SvgIcon'
import { Process } from '@renderer/types/Process'
import { useEffect, useState } from 'react'
import { ReactComponent as LeagueClient } from '../assets/LeagueClient.svg'
import { ReactComponent as RiotClient } from '../assets/RiotClient.svg'

export const LeagueOfLegendsPage = () => {
  const [runningLolClients, setRunningLolClients] = useState<Process[]>([])

  useEffect(() => {
    const interval = setInterval(async () => {
      const runningClients =
        await window.ProcessHandler.checkForRunningLolClients(runningLolClients)

      setRunningLolClients(runningClients)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const launchLolClient = async (): Promise<void> => {
    const process = await window.ProcessHandler.launchProcess(runningLolClients.length)

    setRunningLolClients((prev) => [...prev, process])
  }

  const stopAllClients = async (): Promise<void> => {
    try {
      await window.ProcessHandler.stopProcess(runningLolClients)
      setRunningLolClients([])
    } catch (error) {}
  }

  return (
    <Grid container columns={12} spacing={1} marginTop={1} paddingX={1}>
      <Grid item xs={6}>
        <Box>
          <Paper sx={{ display: 'flex', padding: '10px' }}>
            <Stack direction="row" alignItems="center" gap={3}>
              <Tooltip title="Launch a Client">
                <IconButton color="success" onClick={launchLolClient}>
                  <RocketLaunchIcon sx={{ height: '20px' }}></RocketLaunchIcon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Close all Clients">
                <span>
                  <IconButton
                    color="error"
                    disabled={runningLolClients.length > 0 ? false : true}
                    onClick={stopAllClients}
                  >
                    <CloseIcon sx={{ height: '20px' }}></CloseIcon>
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Paper>
        </Box>
      </Grid>

      <Grid item xs={5}>
        <Box>
          <Paper sx={{ display: 'flex', padding: '10px' }}>
            <Tooltip title="Currently running Clients">
              <Stack direction="row" alignItems="center" gap={3}>
                <Typography variant="h6" fontSize={22}>
                  mh370 abduct ufo
                </Typography>
              </Stack>
            </Tooltip>
          </Paper>
        </Box>
      </Grid>
      <Grid item xs={1}>
        <Box>
          <Paper sx={{ display: 'flex', padding: '10px' }}>
            <Tooltip title="Currently running Clients">
              <Stack
                direction="row"
                alignItems="center"
                gap={3}
                sx={{ marginLeft: 'auto', marginRight: '10px' }}
              >
                <SvgIcon viewBox="0 0 48 48" sx={{ height: '20px' }}>
                  <LeagueClient></LeagueClient>
                </SvgIcon>
                <Typography variant="h6" fontSize={22}>
                  {runningLolClients.length}
                </Typography>
              </Stack>
            </Tooltip>
          </Paper>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <Paper sx={{ display: 'flex', padding: '10px' }}>
            <Tooltip title="League install path">
              <Box>
                <Typography variant="caption" color="grey">
                  League Client Path
                </Typography>
                <Stack direction="row" alignItems="center" gap={3}>
                  <SvgIcon viewBox="0 0 48 48" sx={{ height: '50px' }}>
                    <LeagueClient></LeagueClient>
                  </SvgIcon>
                  <Typography variant="h6" fontSize={18}>
                    C:/Riot Games/Riot Client/RiotClientServices.exe
                  </Typography>
                </Stack>
              </Box>
            </Tooltip>
          </Paper>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Box>
          <Paper sx={{ display: 'flex', padding: '10px' }}>
            <Tooltip title="Riot install path">
              <Box>
                <Typography variant="caption" color="grey">
                  Riot Client Path
                </Typography>
                <Stack direction="row" alignItems="center" gap={3}>
                  <SvgIcon viewBox="0 0 48 48" sx={{ height: '50px' }}>
                    <RiotClient></RiotClient>
                  </SvgIcon>
                  <Typography variant="h6" fontSize={18}>
                    C:/Riot Games/Riot Client/RiotClientServices.exe
                  </Typography>
                </Stack>
              </Box>
            </Tooltip>
          </Paper>
        </Box>
      </Grid>
    </Grid>

    // sx={{ marginLeft: 'auto', marginRight: '0' }}

    // <Button
    //   variant="outlined"
    //   onClick={async () => {
    //     console.log(process)
    //   }}
    // >
    //   <WavingHandIcon></WavingHandIcon>
    // </Button>
  )
}
