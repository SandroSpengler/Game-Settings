import { SearchOutlined } from '@mui/icons-material'
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import LCUGameSettings, {
  General,
  Hud,
  LossOfControl,
  Voice,
  Volume
} from '@renderer/interfaces/LCUGameSettings'
import { ChangeEvent, Fragment, useState } from 'react'
import { Performance } from '@renderer/interfaces/LCUGameSettings'

interface IClientSettingsProps {
  clientSettings: LCUGameSettings
}

const Settings = (props: IClientSettingsProps): JSX.Element => {
  const [gameSettings, setClientSettings] = useState<LCUGameSettings>(
    structuredClone(props.clientSettings)
  )
  const [searchSetting, setSearchSetting] = useState<string>('')

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

  const handleSearchSettingInput = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    event.preventDefault()

    if (!event.target.value || event.target.value.trim() === '') {
      setClientSettings(structuredClone(props.clientSettings))
      setSearchSetting('')

      return
    }

    setSearchSetting(event.target.value)

    let filteredObject = {}

    Object.keys(props.clientSettings.General).forEach((key) => {
      if (key.toLowerCase().includes(event.target.value.trim().toLowerCase())) {
        filteredObject[key] = props.clientSettings.General[key]
      }
    })

    if (Object.keys(filteredObject).length > 0) {
      gameSettings.General = filteredObject as any

      setClientSettings(gameSettings)
    }
  }

  return (
    <Box>
      <Paper sx={{ padding: '10px' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontSize={20} marginBottom="10px">
            Game Settings
          </Typography>

          <Tooltip title="Search for a specific setting">
            <FormControl>
              <InputLabel>Setting</InputLabel>
              <OutlinedInput
                id="outlined-seach-input"
                label="Setting"
                value={searchSetting}
                onChange={handleSearchSettingInput}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Tooltip>
        </Toolbar>
        <Stack direction="column" width="100%" margin="10px">
          <Box>
            <Paper style={{ padding: '15px', margin: '0px 0px 10px 0px' }}>
              <Typography color="grey" fontSize={20} marginBottom="10px">
                General
              </Typography>

              {gameSettings.General && mapSettings(gameSettings.General)}
            </Paper>
          </Box>
          <Box>
            <Paper style={{ padding: '15px' }}>
              <Typography color="grey" fontSize={20} marginBottom="10px">
                HUD
              </Typography>
              {gameSettings.HUD && mapSettings(gameSettings.HUD)}
            </Paper>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}
export default Settings
