import CloseIcon from '@mui/icons-material/Close'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import {
  Alert,
  Box,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'

import SvgIcon from '@mui/material/SvgIcon'
import Process from '@renderer/types/Process'

import { client } from '@renderer/types/ClientTypes'
import { Fragment, useEffect, useState } from 'react'
import { ReactComponent as LeagueClient } from '../assets/LeagueClient.svg'
import { ReactComponent as RiotClient } from '../assets/RiotClient.svg'

import LCUProperties from '@renderer/interfaces/LCUProperties'
import path from 'path'

export const LeagueOfLegendsPage = (): JSX.Element => {
  const [runningLolClients, setRunningLolClients] = useState<Process[]>([])

  const [pathError, setPathError] = useState<string>('')
  const [launchError, setLaunchError] = useState<string>('')

  const [riotClientInstallPath, setRiotClientInstallPath] = useState<string>('')
  const [leagueClientInstallPath, setLeagueClientInstallPath] = useState<string>('')

  const [leagueClientProperties, setLeagueClientProperties] = useState<LCUProperties>()

  useEffect(() => {
    const interval = setInterval(async () => {
      const runningClients =
        await window.ProcessHandler.checkForRunningLolClients(runningLolClients)

      setRunningLolClients(runningClients)
    }, 2500)
    return (): void => clearInterval(interval)
  }, [])

  useEffect(() => {
    setInstallPaths()
  }, [])

  useEffect(() => {
    if (runningLolClients.length === 0) return

    setSummonerInformation()
  }, [runningLolClients.length])

  useEffect(() => {
    if (!leagueClientProperties) return

    console.log('requesting....')

    // on lcuProperties change request summoner data from client
    // ToDO
    // Use ReactQuery
    // const summonerInfo = await getSummoner(leagueClientProperties)
    // console.log(summonerInfo)
  }, [leagueClientProperties?.port])

  const setSummonerInformation = async (): Promise<void> => {
    const lcuProperties = await window.ProcessHandler.readLCUProperties()

    setLeagueClientProperties(lcuProperties)
  }

  const setInstallPaths = async (): Promise<void> => {
    let leagueClientInstallPath = ''
    let riotClientInstallPath = ''
    try {
      leagueClientInstallPath = await window.ProcessHandler.getLeagueClientInstallPath()
      riotClientInstallPath = await window.ProcessHandler.getRiotClientInstallPath()

      /* eslint-disable  @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      leagueClientInstallPath = ''
      riotClientInstallPath = ''

      setPathError(error.message)
    } finally {
      setLeagueClientInstallPath(leagueClientInstallPath)
      setRiotClientInstallPath(riotClientInstallPath)
    }
  }

  const launchLolClient = async (): Promise<void> => {
    try {
      const process = await window.ProcessHandler.launchProcess(runningLolClients.length)

      setRunningLolClients((prev) => [...prev, process])

      /* eslint-disable  @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      setLaunchError('Could not launch Client please verify install paths')
    }
  }

  const stopAllClients = async (): Promise<void> => {
    await window.ProcessHandler.stopProcess(runningLolClients)
    setRunningLolClients([])
  }

  const pickClientPath = async (client: client): Promise<void> => {
    let clientPath = ''

    try {
      clientPath = await window.ProcessHandler.pickClientPath(client)

      if (client === 'league') {
        const dirName = path.dirname(clientPath)
        setLeagueClientInstallPath(dirName)
      }

      if (client === 'riot') {
        const dirName = path.dirname(clientPath)

        setRiotClientInstallPath(dirName)
      }
    } catch (error) {
      const errorMessage = `${client}: path does not contain a client`

      setLaunchError(errorMessage)
    }
  }

  return (
    <Fragment>
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
                <Tooltip title="Choose Riot Client Path">
                  <span>
                    <IconButton color="error" onClick={(): Promise<void> => pickClientPath('riot')}>
                      <SvgIcon viewBox="0 0 48 48" sx={{ height: '20px' }}>
                        <RiotClient></RiotClient>
                      </SvgIcon>
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Choose League Client Path">
                  <span>
                    <IconButton
                      color="error"
                      onClick={(): Promise<void> => pickClientPath('league')}
                    >
                      <SvgIcon viewBox="0 0 48 48" sx={{ height: '20px' }}>
                        <LeagueClient></LeagueClient>
                      </SvgIcon>
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
                      {/* C:/Riot Games/Riot Client/RiotClientServices.exe */}
                      {leagueClientInstallPath}
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
                      {/* C:/Riot Games/Riot Client/RiotClientServices.exe */}
                      {riotClientInstallPath}
                    </Typography>
                  </Stack>
                </Box>
              </Tooltip>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <Snackbar open={pathError === '' ? false : true} autoHideDuration={6000}>
        <Alert severity="error">{pathError.split(':')[2]}</Alert>
      </Snackbar>

      <Snackbar
        open={launchError === '' ? false : true}
        autoHideDuration={4000}
        onClose={(): void => setLaunchError('')}
      >
        <Alert severity="error">{launchError} </Alert>
      </Snackbar>
    </Fragment>
  )
}
