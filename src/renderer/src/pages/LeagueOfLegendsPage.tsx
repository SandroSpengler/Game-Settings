import { Button } from '@mui/material'
import WavingHandIcon from '@mui/icons-material/WavingHand'

const LeagueOfLegendsPage = () => {
  return (
    <Button
      variant="outlined"
      onClick={async () => {
        // const process = await window.ProcessHandler.launchProcess()
        // colorMode.toggleColorMode()
        // console.log(process)
      }}
    >
      <WavingHandIcon></WavingHandIcon>
    </Button>
  )
}

export default LeagueOfLegendsPage
