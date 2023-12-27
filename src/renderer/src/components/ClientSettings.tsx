import { AppBar, Box, Paper, Stack, Toolbar, Tooltip, Typography } from '@mui/material'
import App from '@renderer/App'
import LCUGameSettings, {
  General,
  Hud,
  LossOfControl,
  Voice,
  Volume
} from '@renderer/interfaces/LCUClientSettings'
import { Fragment } from 'react'

interface IClientSettingsProps {
  clientSettings: LCUGameSettings
}

const ClientSettings = (props: IClientSettingsProps): JSX.Element => {
  const mapSettings = (
    object: General | Hud | LossOfControl | Performance | Voice | Volume
  ): JSX.Element => {
    const objectEntries = Object.entries(object)

    return (
      <Fragment>
        {objectEntries.map(([key, value], i) => {
          return (
            <Typography key={i} variant="body1" fontSize={16}>
              {key} {typeof value} {String(value)}
            </Typography>
          )
        })}
      </Fragment>
    )
  }

  return (
    <Box>
      <Paper sx={{ padding: '10px' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontSize={20} marginBottom="10px">
            Client Settings
          </Typography>
          <Typography fontSize={20} marginBottom="10px">
            Search Settings
          </Typography>
        </Toolbar>
        <Stack direction="column" width="100%" margin="10px">
          <Box>
            <Paper style={{ padding: '15px', margin: '0px 0px 10px 0px' }}>
              <Typography color="grey" fontSize={20} marginBottom="10px">
                General
              </Typography>
              {mapSettings(props.clientSettings.General)}
            </Paper>
          </Box>
          <Box>
            <Paper style={{ padding: '15px' }}>
              <Typography color="grey" fontSize={20} marginBottom="10px">
                HUD
              </Typography>
              {mapSettings(props.clientSettings.HUD)}
            </Paper>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}
export default ClientSettings
