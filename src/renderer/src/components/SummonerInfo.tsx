import { Box, CircularProgress, Paper, Stack, Tooltip, Typography } from '@mui/material'
import LCUProperties from '@renderer/interfaces/LCUProperties'
import { getSummoner } from '@renderer/services/LCUService'
import { useQuery } from 'react-query'

interface SummonerInfoProps {
  LCUProperties: LCUProperties
}

const SummonerInfo = (props: SummonerInfoProps): JSX.Element => {
  const { isLoading, data } = useQuery(
    ['SummonerInfo', props.LCUProperties],
    () => getSummoner(props.LCUProperties),
    {
      staleTime: 60000
    }
  )

  return (
    <Box>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ display: 'flex', padding: '10px' }}>
          <Tooltip title="Currently logged in Summoner">
            <Stack direction="row" alignItems="center" gap={3}>
              <Typography variant="h6" fontSize={22}>
                {data?.displayName}
              </Typography>
            </Stack>
          </Tooltip>
        </Paper>
      )}
    </Box>
  )
}

export default SummonerInfo
