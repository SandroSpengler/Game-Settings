import cp from 'child_process'
import find from 'find-process'
import { kill } from 'process'

import Store from 'electron-store'
import Process from '../../renderer/src/types/Process'
import SettingsStore, { StoreSettingsSchema } from '../../renderer/src/types/SettingsStore'
import fs from 'fs'

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

    const binPath = (process as any).bin || ''

    const client: Process = {
      cmd: [process.cmd],
      pid: process.pid,
      name: process.name,
      bin: binPath
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
  let needToResetPath = false
  let errorMessage = ''

  try {
    await validateLeagueClientPath(settingsStore.store.leagueClientPath)

    needToResetPath = false

    return settingsStore.store.leagueClientPath
  } catch (error: any) {
    needToResetPath = true
    errorMessage = error.message
  }

  try {
    const runningClients = await checkForRunningLolClients([])

    if (runningClients.length > 0) {
      if (runningClients[0].bin !== '') {
        console.log(runningClients[0].bin!)
        await validateLeagueClientPath(runningClients[0].bin!)

        settingsStore.set('leagueClientPath', runningClients[0].bin!)

        needToResetPath = false
        return settingsStore.store.leagueClientPath
      }
    }
  } catch (error: any) {
    console.log(error)
    needToResetPath = true
    errorMessage = 'could not automatically determine client path'
  }

  try {
  } catch (error) {}
  // 3. check default location
  //
  // 4.
  //  setPath = ""
  //  catch error
  // errormessage += could not determine path + error.message
  // error.message -> no client running
  // error.message -> the currently running client provides no install path information

  if (needToResetPath) {
    settingsStore.set('leagueClientPath', '')
    // save to store

    throw new Error(errorMessage)
  }

  return settingsStore.store.leagueClientPath
}

export const getRiotClientInstallPath = async (): Promise<string> => {
  // getStoreSettings

  // 1. check last saved directory
  // if StoreSettings.RiotClientInstallPath !== ""
  //  if StoreSettings.RiotClientInstallPath.contains === RiotClientService.exe
  //    true ->ß
  //      return path

  // 2. check running client
  // if running client count > 0

  //  if runningClient.InstallPath.contains === RiotClientService.exe
  //    true ->
  //     StoreSettings.RiotClientInstallPath = runningClient.InstallPath
  //     return path
  //
  // 3. check default location
  //
  // 4.
  // setPath = ""
  // throw new error -> please validate riot client install path
  return ''
}

export const getStore = async (): Promise<Store<SettingsStore>> => {
  // ToDo
  // Handle validation error -> store corrupt -> reset store
  const store = new Store({ schema: StoreSettingsSchema })

  return store
}

export const validateLeagueClientPath = async (leagueClientPath: string): Promise<string> => {
  if (leagueClientPath === '') {
    throw new Error('saved client path is invalid')
  }

  const pathExists = fs.existsSync(leagueClientPath)

  if (!pathExists) {
    throw new Error('saved client path is invalid')
  }

  const lockFileExsits = fs.existsSync(`${leagueClientPath}/LeagueClient.exe`)

  if (!lockFileExsits) {
    throw new Error('saved client path is invalid')
  }

  // validate Lockfile / read it out
  // const fileContent = fs.readFileSync('C:/Riot Games/League of Legends/lockfile', {
  //   encoding: 'binary'
  // })

  // return fileContent

  return leagueClientPath
}
