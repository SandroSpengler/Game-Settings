import { Box, Paper, Stack, Tooltip, Typography } from '@mui/material'

const ClientSettings = (): JSX.Element => {
  return (
    <Box>
      <Paper sx={{ display: 'flex', padding: '10px' }}>
        <Tooltip title="Riot install path">
          <Box>
            <Typography variant="caption" color="grey">
              Client Settings
            </Typography>
            <Stack direction="row" alignItems="center" gap={3}>
              <Typography variant="h6" fontSize={18}>
                {/* C:/Riot Games/Riot Client/RiotClientServices.exe */}
                Settings
              </Typography>
            </Stack>
          </Box>
        </Tooltip>
      </Paper>
    </Box>
  )
}

export default ClientSettings
