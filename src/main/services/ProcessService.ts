import cp from 'child_process'
import find from 'find-process'
import { kill } from 'process'

import Store from 'electron-store'
import Process from '../../renderer/src/types/Process'
import SettingsStore, { StoreSettingsSchema } from '../../renderer/src/types/SettingsStore'
import fs from 'fs'

export const launchProcess = async (clientCount: number): Promise<Process> => {
  const launchArgs: string[] = ['--launch-product=league_of_legends', '--launch-patchline=live']
  const settingsStore = await getStore()

  let lolClient

  if (clientCount > 0) {
    launchArgs.push('--allow-multiple-clients')
  }

  try {
    lolClient = cp.spawn(
      `${settingsStore.store.riotClientPath}/RiotClientServices.exe`,
      launchArgs,
      {
        detached: true
      }
    )

    lolClient.unref()

    const spawnedClient: Process = {
      cmd: lolClient.spawnargs,
      bin: lolClient.spawnfile,
      pid: lolClient.pid!
    }

    return spawnedClient
  } catch (error) {
    throw error
  }
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
    await validateLeagueClientPath('C:/Riot Games/League of Legends')

    needToResetPath = false
    settingsStore.set('leagueClientPath', 'C:/Riot Games/League of Legends')
  } catch (error) {
    errorMessage = 'could not determine League of Legends install path'
    needToResetPath = true
  }

  if (needToResetPath) {
    settingsStore.set('leagueClientPath', '')

    throw new Error(errorMessage)
  }

  return settingsStore.store.leagueClientPath
}

export const getRiotClientInstallPath = async (): Promise<string> => {
  const settingsStore = await getStore()
  let needToResetPath = false
  let errorMessage = ''

  try {
    await validateRiotClientPath(settingsStore.store.riotClientPath)

    needToResetPath = false

    return settingsStore.store.riotClientPath
  } catch (error: any) {
    needToResetPath = true
    errorMessage = error.message
  }

  try {
    await validateRiotClientPath('C:/Riot Games/Riot Client')

    needToResetPath = false
    settingsStore.set('riotClientPath', 'C:/Riot Games/Riot Client')
  } catch (error) {
    errorMessage = 'Could not determine Riot Client install path'
  }

  if (needToResetPath) {
    settingsStore.set('riotClientPath', '')

    throw new Error(errorMessage)
  }

  return settingsStore.store.leagueClientPath
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

  const LeagueClientExsits = fs.existsSync(`${leagueClientPath}/LeagueClient.exe`)

  if (!LeagueClientExsits) {
    throw new Error('saved client path is invalid')
  }

  // validate Lockfile / read it out
  // const fileContent = fs.readFileSync('C:/Riot Games/League of Legends/lockfile', {
  //   encoding: 'binary'
  // })

  // return fileContent

  return leagueClientPath
}

export const validateRiotClientPath = async (riotClientPath: string): Promise<string> => {
  if (riotClientPath === '') {
    throw new Error('saved client path is invalid')
  }

  const pathExists = fs.existsSync(riotClientPath)

  if (!pathExists) {
    throw new Error('saved client path is invalid')
  }

  const LeagueClientExsits = fs.existsSync(`${riotClientPath}/RiotClientServices.exe`)

  if (!LeagueClientExsits) {
    throw new Error('saved client path is invalid')
  }

  // validate Lockfile / read it out
  // const fileContent = fs.readFileSync('C:/Riot Games/League of Legends/lockfile', {
  //   encoding: 'binary'
  // })

  // return fileContent

  return riotClientPath
}
