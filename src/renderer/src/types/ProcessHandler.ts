import { client } from './ClientTypes'
import Process from './Process'
import SettingsStore from './SettingsStore'

type ProcessHandler = {
  stopProcess: (processes: Process[]) => Promise<void>
  checkForRunningLolClients: (runningLolClients: Process[]) => Promise<Process[]>
  // main process
  launchProcess: (clientCount: number) => Promise<Process>
  pickClientPath: (client: client) => Promise<string>
  getLeagueClientInstallPath: () => Promise<string>
  getRiotClientInstallPath: () => Promise<string>
  getStore: () => Promise<SettingsStore>
}

export default ProcessHandler
