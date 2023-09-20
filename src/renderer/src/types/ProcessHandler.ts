import Process from './Process'
import SettingsStore from './SettingsStore'

type ProcessHandler = {
  launchProcess: (clientCount: number) => Promise<Process>
  stopProcess: (processes: Process[]) => Promise<void>
  checkForRunningLolClients: (runningLolClients: Process[]) => Promise<Process[]>
  getLeagueClientInstallPath: () => Promise<string>
  getRiotClientInstallPath: () => Promise<string>
  getStore: () => Promise<SettingsStore>
}

export default ProcessHandler
