import { Process } from './Process'

export type ProcessHandler = {
  launchProcess: (clientCount: number) => Promise<Process>
  stopProcess: (processes: Process[]) => Promise<void>
  checkForRunningLolClients: (runningLolClients: Process[]) => Promise<Process[]>
}
