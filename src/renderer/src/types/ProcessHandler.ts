import Process from './Process'
import SettingsStore from './SettingsStore'

type ProcessHandler = {
  stopProcess: (processes: Process[]) => Promise<void>
  checkForRunningLolClients: (runningLolClients: Process[]) => Promise<Process[]>
  launchProcess: (clientCount: number) => Promise<Process>
  getLeagueClientInstallPath: () => Promise<string>
  getRiotClientInstallPath: () => Promise<string>
  getStore: () => Promise<SettingsStore>
}

export default ProcessHandler
