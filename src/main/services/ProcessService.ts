import cp from 'child_process'
import find from 'find-process'
import { kill } from 'process'

import Store from 'electron-store'
import Process from '../../renderer/src/types/Process'
import SettingsStore, { StoreSettingsSchema } from '../../renderer/src/types/SettingsStore'

export const launchProcess = async (clientCount: number): Promise<Process> => {
  const launchArgs: string[] = ['--launch-product=league_of_legends', '--launch-patchline=live']

  if (clientCount > 0) {
    launchArgs.push('--allow-multiple-clients')
  }

  const lolClient = cp.spawn('C:/Riot Games/Riot Client/RiotClientServices.exe', launchArgs, {
    detached: true
  })

  lolClient.unref()

  const spawnedClient: Process = {
    cmd: lolClient.spawnargs,
    bin: lolClient.spawnfile,
    pid: lolClient.pid!
  }

  return spawnedClient
}

export const stopProcess = async (processes: Process[]): Promise<void> => {
  for (let process of processes) {
    const systemProcesses = await find('pid', process.pid!)

    if (systemProcesses.length > 0) {
      kill(process.pid!)
    }
  }
}

export const checkForRunningLolClients = async (
  runningLolClients: Process[]
): Promise<Process[]> => {
  // regex all: (.*?)

  const runningProcesses = await find('name', 'LeagueClient.exe')

  const runningClients: Process[] = runningLolClients

  if (runningProcesses.length === 0) {
    return runningClients
  }

  for (let process of runningProcesses) {
    if (process.name === 'LeagueClientUx.exe') {
      continue
    }

    const client: Process = {
      cmd: [process.cmd],
      pid: process.pid,
      name: process.name
    }

    const alreadyRunning = runningClients.find((client) => client.pid === process.pid)

    if (alreadyRunning) {
      continue
    }

    runningClients.push(client)
  }

  return runningClients
}

export const getLeagueClientInstallPath = async (): Promise<string> => {
  const settingsStore = await getStore()

  // getStoreSettings
  //
  // 1. check last saved directory
  // if StoreSettings.LeagueInstallPath.contains Lockfile
  //    true ->
  //      return path
  //
  // 2. check running client
  // if running client count > 0
  //  if runningClient.InstallPath.contains === Lockfile
  //    true ->
  //     StoreSettings.LeagueInstallPath = runningClient.InstallPath
  //     return path
  //
  // 3. check default location
  //
  // 4. throw new error -> please validate league of legends install path

  console.log(settingsStore.leagueClientPath)
  return settingsStore.leagueClientPath
}

export const getRiotClientInstallPath = async (): Promise<string> => {
  // getStoreSettings
  //
  // 1. check last saved directory
  // if StoreSettings.RiotClientInstallPath !== ""
  //  if StoreSettings.RiotClientInstallPath.contains === RiotClientService.exe
  //    true ->
  //      return path
  //
  // 2. check running client
  // if running client count > 0
  //  if runningClient.InstallPath.contains === RiotClientService.exe
  //    true ->
  //     StoreSettings.RiotClientInstallPath = runningClient.InstallPath
  //     return path
  //
  // 3. check default location
  //
  // 4. throw new error -> please validate riot client install path
  return ''
}

export const getStore = async (): Promise<SettingsStore> => {
  // ToDo
  // Handle validation error -> store corrupt -> reset store
  const store = new Store({ schema: StoreSettingsSchema })

  return store.store
}
