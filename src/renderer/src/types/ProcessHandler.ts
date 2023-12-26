import LCUProperties from '@renderer/interfaces/LCUProperties'
import { client } from './ClientTypes'
import Process from './Process'
import SettingsStore from './SettingsStore'
import { OSInformation } from './OSInformation'

export type ProcessHandler = {
  stopProcess: (processes: Process[]) => Promise<void>
  checkForRunningLolClients: (runningLolClients: Process[]) => Promise<Process[]>
  determineLeagueClientInstallPath: () => Promise<string>
  // main process
  launchProcess: (clientCount: number) => Promise<Process>
  pickClientPath: (client: client) => Promise<string>
  getLeagueClientInstallPath: () => Promise<string>
  getRiotClientInstallPath: () => Promise<string>
  getOsInformation: () => Promise<OSInformation>
  readLCUProperties: () => Promise<LCUProperties>
  getStore: () => Promise<SettingsStore>
}

export default ProcessHandler
