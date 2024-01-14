const devEnv = import.meta.env.DEV

import CloseIcon from '@mui/icons-material/Close'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Grow,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'

import SvgIcon from '@mui/material/SvgIcon'
import Process from '@renderer/types/Process'

import { client } from '@renderer/types/ClientTypes'
import { Fragment, useEffect, useState } from 'react'

import { ReactComponent as LeagueClient } from '../assets/Logo/LeagueClient.svg'
import { ReactComponent as RiotClient } from '../assets/Logo/RiotClient.svg'

import { ImportExport } from '@mui/icons-material'
import ImportExportSettings from '@renderer/components/ImportExportSettings'
import Settings from '@renderer/components/Settings'
import SummonerInfo from '@renderer/components/SummonerInfo'
import LCUGameSettings from '@renderer/interfaces/LCUGameSettings'
import { LCUInputSettings } from '@renderer/interfaces/LCUInputSettings'
import LCUProperties from '@renderer/interfaces/LCUProperties'
import { getGameSettings, getInputSettings } from '@renderer/services/LCUService'
import ProcessHandler from '@renderer/types/ProcessHandler'
import { enqueueSnackbar } from 'notistack'
import './LeagueOfLegendsPage.css'

export const LeagueOfLegendsPage = (): JSX.Element => {
  const theme = useTheme()

  const [runningLolClients, setRunningLolClients] = useState<Process[]>([])

  const [riotClientInstallPath, setRiotClientInstallPath] = useState<string>('')
  const [leagueClientInstallPath, setLeagueClientInstallPath] = useState<string>('')

  const [leagueClientProperties, setLeagueClientProperties] = useState<LCUProperties>()
  const [lcuGameSettings, setLcuGameSettings] = useState<LCUGameSettings>()
  const [lcuInputSettings, setLcuInputSettings] = useState<LCUInputSettings>()

  const [showImportExportDialog, setShowImportDialog] = useState<boolean>(false)

  const ProcessHandler = window.ProcessHandler as ProcessHandler

  //#region useEffect
  useEffect(() => {
    setInstallPaths()
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      const runningClients = await ProcessHandler.checkForRunningLolClients(runningLolClients)

      setRunningLolClients(runningClients)
    }, 1000)
    return (): void => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (runningLolClients.length === 0) {
      setLcuGameSettings(undefined)
      setLeagueClientProperties(undefined)

      return
    }

    setSummonerInformation()
  }, [runningLolClients.length])

  const setInstallPaths = async (): Promise<void> => {
    let leagueClientInstallPath = ''
    let riotClientInstallPath = ''

    try {
      riotClientInstallPath = await ProcessHandler.getRiotClientInstallPath()
    } catch (error) {
      riotClientInstallPath = ''

      enqueueSnackbar('Riot Games install path was not found, please select the install path', {
        variant: 'error'
      })
    }

    try {
      leagueClientInstallPath = await ProcessHandler.getLeagueClientInstallPath()
    } catch (error) {
      leagueClientInstallPath = ''

      enqueueSnackbar('League of Legends install path was not found', { variant: 'error' })
    }

    try {
      const runningClients = await ProcessHandler.checkForRunningLolClients([])

      if (runningClients.length > 0) {
        leagueClientInstallPath = await ProcessHandler.determineLeagueClientInstallPath()
      }

      if (leagueClientInstallPath === '') {
        enqueueSnackbar(
          'Please select the LoL-Client path or launch a client and restart the application',
          {
            variant: 'info'
          }
        )
      }
    } catch (error) {
      leagueClientInstallPath = ''

      enqueueSnackbar('Automatically determining League of Legends install path failed', {
        variant: 'error'
      })
    }

    setLeagueClientInstallPath(leagueClientInstallPath)
    setRiotClientInstallPath(riotClientInstallPath)
  }

  const setSummonerInformation = async (): Promise<void> => {
    try {
      const lcuProperties = await ProcessHandler.readLCUProperties()
      const lcuGameSettings = await getGameSettings(lcuProperties)
      const lcuInputSettings = await getInputSettings(lcuProperties)
      // TODO
      // add loading client information indicator
      setLcuGameSettings(lcuGameSettings)
      setLcuInputSettings(lcuInputSettings)
      setLeagueClientProperties(lcuProperties)

      /* eslint-disable  @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      console.error(error.message)
    } finally {
    }
  }

  //#endregion

  //#region UI-Buttons
  const launchLolClient = async (): Promise<void> => {
    try {
      const process = await ProcessHandler.launchProcess(runningLolClients.length)

      setRunningLolClients((prev) => [...prev, process])
      setLcuGameSettings(undefined)
      setLeagueClientProperties(undefined)
    } catch (error) {
      // TODO
      // Handle Launch Error
    }
  }

  const stopAllClients = async (): Promise<void> => {
    await ProcessHandler.stopProcess(runningLolClients)
    setRunningLolClients([])
  }

  const pickClientPath = async (client: client): Promise<void> => {
    let clientPath = ''

    try {
      clientPath = await ProcessHandler.pickClientPath(client)

      if (client === 'league') {
        setLeagueClientInstallPath(clientPath)
      }

      if (client === 'riot') {
        setRiotClientInstallPath(clientPath)
      }
    } catch (error) {
      const errorMessage = `${client}: path does not contain a client`

      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }

  const toggleShowImportExportDialog = () => {
    setShowImportDialog(!showImportExportDialog)
  }

  //#endregion

  return (
    <Fragment>
      <Grid container columns={12} spacing={1} marginTop={1} paddingX={1}>
        {devEnv && runningLolClients.length > 0 && leagueClientProperties && (
          <Grow in={true} timeout={750}>
            <Grid item xs={12}>
              <Paper
                sx={{ display: 'flex', padding: '10px', background: theme.palette.secondary.light }}
              >
                <Tooltip title="League Client Dev Info">
                  <Stack direction="row" alignItems="center" gap={3}>
                    <Box style={{ padding: '2px 10px 2px 10px' }}>
                      <Typography variant="caption" color="grey">
                        ProcessName
                      </Typography>
                      <Typography>{leagueClientProperties.processName}</Typography>
                    </Box>
                    <Box style={{ padding: '2px 10px 2px 10px' }}>
                      <Typography variant="caption" color="grey">
                        Process Id
                      </Typography>
                      <Typography>{leagueClientProperties.processId}</Typography>
                    </Box>
                    <Box style={{ padding: '2px 10px 2px 10px' }}>
                      <Typography variant="caption" color="grey">
                        Port
                      </Typography>
                      <Typography>{leagueClientProperties.port}</Typography>
                    </Box>
                    <Box style={{ padding: '2px 10px 2px 10px' }}>
                      <Typography variant="caption" color="grey">
                        Username
                      </Typography>
                      <Typography>riot</Typography>
                    </Box>
                    <Box style={{ padding: '2px 10px 2px 10px' }}>
                      <Typography variant="caption" color="grey">
                        Password
                      </Typography>
                      <Typography>{leagueClientProperties.password}</Typography>
                    </Box>
                    <Box style={{ padding: '2px 10px 2px 10px' }}>
                      <Typography variant="caption" color="grey">
                        Protocol
                      </Typography>
                      <Typography>{leagueClientProperties.protocol}</Typography>
                    </Box>
                  </Stack>
                </Tooltip>
              </Paper>
            </Grid>
          </Grow>
        )}
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
                <Tooltip
                  title={
                    runningLolClients.length === 0 || !leagueClientProperties
                      ? 'Launch a Client to Export Settings'
                      : 'Export Client Settings'
                  }
                >
                  <span>
                    <IconButton
                      disabled={runningLolClients.length === 0 || !leagueClientProperties}
                      onClick={toggleShowImportExportDialog}
                    >
                      <ImportExport sx={{ height: '20px' }} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Paper>
          </Box>
        </Grid>

        <Grid item xs={5}>
          {leagueClientProperties && <SummonerInfo LCUProperties={leagueClientProperties} />}
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
                      {leagueClientInstallPath === ''
                        ? 'no path was found'
                        : leagueClientInstallPath}
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
                      {riotClientInstallPath === '' ? 'no path was found' : riotClientInstallPath}
                    </Typography>
                  </Stack>
                </Box>
              </Tooltip>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12}>
          {lcuGameSettings && (
            <Grow in={true} timeout={750}>
              <div>
                <Settings clientSettings={lcuGameSettings} />
              </div>
            </Grow>
          )}
        </Grid>
      </Grid>
      {lcuGameSettings && lcuInputSettings && (
        <Box>
          <Dialog
            open={showImportExportDialog}
            slotProps={{ backdrop: { sx: { background: 'none' } } }}
          >
            <DialogTitle>
              <Typography fontSize={24} fontWeight="bold">
                Settings
              </Typography>
            </DialogTitle>
            <DialogContent>
              <ImportExportSettings
                toggleShowImportExportDialog={toggleShowImportExportDialog}
                lcuGameSettings={lcuGameSettings}
                lcuInputSettings={lcuInputSettings}
              />
            </DialogContent>
            {/* <DialogActions>
            <Button variant="outlined" color="success" onClick={toggleShowImportExportDialog}>
              Done
            </Button>
            <Button variant="outlined" color="error" onClick={toggleShowImportExportDialog}>
              Cancel
            </Button>
          </DialogActions> */}
          </Dialog>
        </Box>
      )}
    </Fragment>
  )
}
