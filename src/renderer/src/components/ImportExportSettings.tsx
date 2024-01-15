import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import { SelectedSetting } from '@renderer/enums/SelectedSettings'
import LCUGameSettings from '@renderer/interfaces/LCUGameSettings'
import { LCUInputSettings } from '@renderer/interfaces/LCUInputSettings'
import LCUProperties from '@renderer/interfaces/LCUProperties'
import {
  SelectedGameSettings,
  SelectedInputSettings,
  selectedSettings,
  selectedSettingsKeys
} from '@renderer/interfaces/SelectedSettings'
import { patchGameSettings } from '@renderer/services/LCUService'
import { enqueueSnackbar } from 'notistack'
import { useState } from 'react'
interface ImportExportProps {
  toggleShowImportExportDialog: () => void
  lcuProperties: LCUProperties
  lcuGameSettings: LCUGameSettings
  lcuInputSettings: LCUInputSettings
}

export const ImportExportSettings = (props: ImportExportProps): JSX.Element => {
  const theme = useTheme()
  const ProcessHandler = window.ProcessHandler

  const [open, setOpen] = useState([false, false])
  const [enableExport, setEnableExport] = useState<boolean>(false)
  const [enableImport, setEnableImport] = useState<boolean>(false)
  const [showImportProgress, setShowImportProgress] = useState<boolean>(false)
  const [importSuccess, setImportSuccess] = useState<boolean>(true)
  const [importProgress, setImportProgress] = useState<number>(0)

  const [selectedGameSettings, setSelectedGameSettings] = useState<SelectedGameSettings>({
    AllGameSettings: false,
    FloatingText: false,
    General: false,
    HUD: false,
    LossOfControl: false,
    Performance: false,
    Voice: false,
    Volume: false
  })

  const [selectedInputSettings, setSelectedInputSettings] = useState<SelectedInputSettings>({
    AllInputSettings: false,
    GameEvents: false,
    HUDEvents: false,
    Quickbinds: false,
    ShopEvents: false
  })

  const handleClick = (selectedSetting: SelectedSetting) => {
    selectedSetting === 0
      ? setOpen((prev) => [!prev[0], prev[1]])
      : setOpen((prev) => [prev[0], !prev[1]])
  }

  const importFile = async (): Promise<void> => {
    const fileResult = await ProcessHandler.importFile()

    const lcuSettingsRaw: LCUGameSettings & LCUInputSettings = JSON.parse(fileResult)
    let lcuSettings: LCUGameSettings & LCUInputSettings = {} as any

    for (const key of Object.keys(lcuSettingsRaw)) {
      if (selectedGameSettings[key] || selectedInputSettings[key]) {
        lcuSettings[key] = lcuSettingsRaw[key]
      }
    }

    if (Object.keys(lcuSettings).length === 0) {
      enqueueSnackbar('File does not contain any importable settings', {
        variant: 'error'
      })

      return
    }

    setImportProgress(0)
    setEnableExport(false)
    setEnableImport(false)
    setShowImportProgress(true)

    try {
      if (Object.values(selectedGameSettings).some(Boolean)) {
        await patchGameSettings(props.lcuProperties, lcuSettings)
        setImportProgress(50)

        enqueueSnackbar(`Game Settings have been imported`, {
          variant: 'success'
        })

        if (!Object.values(selectedInputSettings).some(Boolean)) {
          setImportProgress(100)
        }
      }

      if (Object.values(selectedInputSettings).some(Boolean)) {
        await patchGameSettings(props.lcuProperties, lcuSettings)
        setImportProgress(100)
        setImportSuccess(true)
        setShowImportProgress(false)

        enqueueSnackbar(`Input Settings have been imported`, {
          variant: 'success'
        })
      }

      props.toggleShowImportExportDialog()
    } catch (error) {
      setImportProgress(0)
      setImportSuccess(false)
    }
  }

  /**
   * Allows for the selection of individual checkboxes and sets property allSettings to true if every checkbox is selected otherwise false
   *
   * This function is generic and disgusting
   *
   * @param event React DOM event
   * @param selectedSetting Enum to determine to which object the property belongs
   * @param settingName Object key of the selected checkbox
   * @returns
   */
  const handleChangeGameSettingsCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>,
    settingKey: selectedSettingsKeys
  ) => {
    event.preventDefault()

    let newState: selectedSettings = {
      ...structuredClone(selectedGameSettings),
      ...structuredClone(selectedInputSettings)
    }

    newState[settingKey] = !newState[settingKey]

    // check or uncheck all AllGameSettings
    if (settingKey === 'AllGameSettings') {
      if (selectedGameSettings.AllGameSettings) {
        for (let key of Object.keys(selectedGameSettings)) {
          newState[key] = false
        }
      } else {
        for (let key of Object.keys(selectedGameSettings)) {
          newState[key] = true
        }
      }
    }

    // check or uncheck all AllInputSettings
    if (settingKey === 'AllInputSettings') {
      if (selectedInputSettings.AllInputSettings) {
        for (let key of Object.keys(selectedInputSettings)) {
          newState[key] = false
        }
      } else {
        for (let key of Object.keys(selectedInputSettings)) {
          newState[key] = true
        }
      }
    }

    // if all properties have been checked, set the AllGameSettings to checked
    if (Object.hasOwn(selectedGameSettings, settingKey)) {
      let allSelectedKeys: string[] = []

      if (!newState[settingKey]) {
        newState.AllGameSettings = false
      }

      for (let key of Object.keys(selectedGameSettings)) {
        if (newState[key]) {
          allSelectedKeys.push(key)
        }
      }

      if (
        Object.keys(selectedGameSettings).length - 1 === allSelectedKeys.length &&
        !allSelectedKeys.includes('AllGameSettings')
      ) {
        newState.AllGameSettings = true
      }
    }

    // if all properties have been checked, set the AllInputSettings to checked
    if (Object.hasOwn(selectedInputSettings, settingKey)) {
      let allSelectedKeys: string[] = []

      if (!newState[settingKey]) {
        newState.AllInputSettings = false
      }

      for (let key of Object.keys(selectedInputSettings)) {
        if (newState[key]) {
          allSelectedKeys.push(key)
        }
      }

      if (
        Object.keys(selectedInputSettings).length - 1 === allSelectedKeys.length &&
        !allSelectedKeys.includes('AllInputSettings')
      ) {
        newState.AllInputSettings = true
      }
    }

    // 1 true property is enough for the export
    if (Object.values(newState!).some(Boolean)) {
      setEnableExport(true)
      setEnableImport(true)
    } else {
      setEnableExport(false)
      setEnableImport(false)
    }

    setSelectedGameSettings({
      AllGameSettings: newState.AllGameSettings,
      FloatingText: newState.FloatingText,
      General: newState.General,
      HUD: newState.HUD,
      LossOfControl: newState.LossOfControl,
      Performance: newState.Performance,
      Voice: newState.Voice,
      Volume: newState.Volume
    })

    setSelectedInputSettings({
      AllInputSettings: newState.AllInputSettings,
      GameEvents: newState.GameEvents,
      HUDEvents: newState.HUDEvents,
      Quickbinds: newState.Quickbinds,
      ShopEvents: newState.ShopEvents
    })
  }

  const exportLCUCLientSettings = (): void => {
    let settingsToExport: LCUGameSettings & LCUInputSettings = {} as any
    const selectedSettings = { ...selectedGameSettings, ...selectedInputSettings }
    const combinedSettings = {
      ...structuredClone(props.lcuGameSettings),
      ...structuredClone(props.lcuInputSettings)
    }

    for (let k of Object.keys(selectedSettings)) {
      if (k === 'AllGameSettings' || k === 'AllInputSettings') {
        continue
      }

      if (selectedSettings[k]) {
        settingsToExport[k] = combinedSettings[k]
      }
    }

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(settingsToExport, null, '\t')
    )}`

    download(jsonString)
  }

  const download = (jsonString: string): void => {
    const link = document.createElement('a')
    link.href = jsonString
    link.download = 'settings.json'

    link.click()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        marginTop: '0px',
        alignItems: 'center'
      }}
    >
      <Stack>
        <Box>
          <Typography variant="body1" margin="0px 0px 10px 0px">
            <Typography variant="body1" component="span" fontWeight="bold">
              Select
            </Typography>{' '}
            the settings you wish to{' '}
            <Typography variant="body1" component="span" fontWeight="bold">
              import
            </Typography>{' '}
            or{' '}
            <Typography variant="body1" component="span" fontWeight="bold">
              export
            </Typography>
          </Typography>
        </Box>
        <Box sx={{ margin: '0px' }}>
          <List
            sx={{
              background: theme.palette.secondary.light,
              borderRadius: '4px'
            }}
          >
            <ListSubheader
              sx={{
                background: theme.palette.secondary.light,
                borderRadius: '4px'
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ padding: '0px 0px' }}
                alignContent="center"
                alignItems="center"
              >
                <Typography>Game Settings</Typography>
                <Stack direction="row" alignContent="center" alignItems="center">
                  <Button onClick={() => handleClick(0)}>
                    {open[0] ? <ExpandLess /> : <ExpandMore />}
                  </Button>
                  <FormControlLabel
                    label=""
                    sx={{ padding: '0px', margin: '0px' }}
                    control={
                      <Checkbox
                        checked={selectedGameSettings.AllGameSettings}
                        onChange={(event) =>
                          handleChangeGameSettingsCheckbox(event, 'AllGameSettings')
                        }
                      />
                    }
                  />
                </Stack>
              </Stack>
            </ListSubheader>

            <Collapse in={open[0]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding dense>
                <ListItem
                  secondaryAction={
                    <Checkbox
                      checked={selectedGameSettings.General}
                      onChange={(event) => handleChangeGameSettingsCheckbox(event, 'General')}
                    ></Checkbox>
                  }
                >
                  <ListItemText primary="General" sx={{ padding: '0px 0px 0px 10px' }} />
                </ListItem>

                <ListItem
                  secondaryAction={
                    <Checkbox
                      checked={selectedGameSettings.HUD}
                      onChange={(event) => handleChangeGameSettingsCheckbox(event, 'HUD')}
                    ></Checkbox>
                  }
                >
                  <ListItemText primary="HUD" sx={{ padding: '0px 0px 0px 10px' }} />
                </ListItem>

                <ListItem
                  secondaryAction={
                    <Checkbox
                      checked={selectedGameSettings.Volume}
                      onChange={(event) => handleChangeGameSettingsCheckbox(event, 'Volume')}
                    ></Checkbox>
                  }
                >
                  <ListItemText primary="Volume" sx={{ padding: '0px 0px 0px 10px' }} />
                </ListItem>

                <ListItem
                  secondaryAction={
                    <Checkbox
                      checked={selectedGameSettings.FloatingText}
                      onChange={(event) => handleChangeGameSettingsCheckbox(event, 'FloatingText')}
                    ></Checkbox>
                  }
                >
                  <ListItemText primary="Floating Text" sx={{ padding: '0px 0px 0px 10px' }} />
                </ListItem>

                <ListItem
                  secondaryAction={
                    <Checkbox
                      checked={selectedGameSettings.Voice}
                      onChange={(event) => handleChangeGameSettingsCheckbox(event, 'Voice')}
                    ></Checkbox>
                  }
                >
                  <ListItemText primary="Voice" sx={{ padding: '0px 0px 0px 10px' }} />
                </ListItem>

                <ListItem
                  secondaryAction={
                    <Checkbox
                      checked={selectedGameSettings.Performance}
                      onChange={(event) => handleChangeGameSettingsCheckbox(event, 'Performance')}
                    ></Checkbox>
                  }
                >
                  <ListItemText primary="Performance" sx={{ padding: '0px 0px 0px 10px' }} />
                </ListItem>

                <ListItem
                  secondaryAction={
                    <Checkbox
                      checked={selectedGameSettings.LossOfControl}
                      onChange={(event) => handleChangeGameSettingsCheckbox(event, 'LossOfControl')}
                    ></Checkbox>
                  }
                >
                  <ListItemText primary="Loss of Control" sx={{ padding: '0px 0px 0px 10px' }} />
                </ListItem>
              </List>
            </Collapse>
          </List>
          <List
            sx={{
              background: theme.palette.secondary.light,
              borderRadius: '4px'
            }}
          >
            <ListSubheader
              sx={{
                background: theme.palette.secondary.light,
                borderRadius: '4px'
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ padding: '0px 0px' }}
                alignContent="center"
                alignItems="center"
              >
                <Typography>Input Settings</Typography>
                <Stack direction="row" alignContent="center" alignItems="center">
                  <Button onClick={() => handleClick(1)}>
                    {open[1] ? <ExpandLess /> : <ExpandMore />}
                  </Button>
                  <FormControlLabel
                    label=""
                    sx={{ padding: '0px', margin: '0px' }}
                    control={
                      <Checkbox
                        checked={selectedInputSettings.AllInputSettings}
                        onChange={(event) =>
                          handleChangeGameSettingsCheckbox(event, 'AllInputSettings')
                        }
                      />
                    }
                  />
                </Stack>
              </Stack>
            </ListSubheader>

            <Collapse in={open[1]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding dense>
                <ListItem
                  secondaryAction={
                    <Checkbox
                      checked={selectedInputSettings.GameEvents}
                      onChange={(event) => handleChangeGameSettingsCheckbox(event, 'GameEvents')}
                    ></Checkbox>
                  }
                >
                  <ListItemText primary="Game Events" sx={{ padding: '0px 0px 0px 10px' }} />
                </ListItem>

                <ListItem
                  secondaryAction={
                    <Checkbox
                      checked={selectedInputSettings.HUDEvents}
                      onChange={(event) => handleChangeGameSettingsCheckbox(event, 'HUDEvents')}
                    ></Checkbox>
                  }
                >
                  <ListItemText primary="HUD Events" sx={{ padding: '0px 0px 0px 10px' }} />
                </ListItem>

                <ListItem
                  secondaryAction={
                    <Checkbox
                      checked={selectedInputSettings.Quickbinds}
                      onChange={(event) => handleChangeGameSettingsCheckbox(event, 'Quickbinds')}
                    ></Checkbox>
                  }
                >
                  <ListItemText primary="Quick Binds" sx={{ padding: '0px 0px 0px 10px' }} />
                </ListItem>

                <ListItem
                  secondaryAction={
                    <Checkbox
                      checked={selectedInputSettings.ShopEvents}
                      onChange={(event) => handleChangeGameSettingsCheckbox(event, 'ShopEvents')}
                    ></Checkbox>
                  }
                >
                  <ListItemText primary="Shop Events" sx={{ padding: '0px 0px 0px 10px' }} />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Box>
        {showImportProgress && (
          <Stack
            direction="column"
            alignItems="center"
            gap={2}
            sx={{ margin: '10px 10px 20px 10px' }}
          >
            <Typography>Importing settings...</Typography>
            <LinearProgress
              value={importProgress}
              variant="determinate"
              sx={{ width: '100%' }}
              color={importSuccess ? 'success' : 'error'}
            />
          </Stack>
        )}
        <Stack direction="row-reverse" gap={1}>
          <Button variant="outlined" color="error" onClick={props.toggleShowImportExportDialog}>
            Cancel
          </Button>
          <Button variant="outlined" disabled={!enableExport} onClick={exportLCUCLientSettings}>
            Export
          </Button>
          <Button variant="outlined" disabled={!enableImport} onClick={importFile}>
            Import
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ImportExportSettings
