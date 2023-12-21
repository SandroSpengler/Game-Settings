import cp from 'child_process'
import find from 'find-process'
import { kill } from 'process'

import Store from 'electron-store'
import Process from '../../renderer/src/types/Process'
import SettingsStore, { StoreSettingsSchema } from '../../renderer/src/types/SettingsStore'
import fs from 'fs'
import { client } from '../../renderer/src/types/ClientTypes'
import { dialog } from 'electron'

import LCUProperties from '../../renderer/src/interfaces/LCUProperties'
import path from 'path'

export const launchProcess = async (clientCount: number): Promise<Process> => {
  const launchArgs: string[] = ['--launch-product=league_of_legends', '--launch-patchline=live']
  const settingsStore = await getStore()

  if (clientCount > 0) {
    launchArgs.push('--allow-multiple-clients')
  }

  const lolClient = cp.spawn(
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
}

export const stopProcess = async (processes: Process[]): Promise<void> => {
  for (const process of processes) {
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

  for (const process of runningProcesses) {
    if (process.name === 'LeagueClientUx.exe') {
      continue
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
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

  // check path saved in store
  try {
    await validateLeagueClientPath(settingsStore.store.leagueClientPath)

    needToResetPath = false

    return settingsStore.store.leagueClientPath
  } catch (error: any) {
    needToResetPath = true
    errorMessage = error.message
  }

  // determine league of legends path automatically
  try {
    await validateLeagueClientPath('C:/Riot Games/League of Legends')

    needToResetPath = false

    settingsStore.set('leagueClientPath', 'C:/Riot Games/League of Legends')
  } catch (error) {
    errorMessage = 'Could not determine League of Legends install path'
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

  return leagueClientPath
}

export const validateRiotClientPath = async (riotClientPath: string): Promise<string> => {
  if (riotClientPath === '') {
    throw new Error('client path is invalid')
  }

  const pathExists = fs.existsSync(riotClientPath)

  if (!pathExists) {
    throw new Error('saved client path is invalid')
  }

  const LeagueClientExsits = fs.existsSync(`${riotClientPath}/RiotClientServices.exe`)

  if (!LeagueClientExsits) {
    throw new Error('saved client path is invalid')
  }

  return riotClientPath
}

export const readLCUProperties = async (): Promise<LCUProperties> => {
  const clientPath = await getLeagueClientInstallPath()

  if (clientPath === '') throw new Error('invalid League Client Path')

  const fileContent = fs.readFileSync(`${clientPath}/lockfile`, {
    encoding: 'binary'
  })

  const properties = fileContent.split(':')

  const lcuProperties: LCUProperties = {
    processName: properties[0],
    processId: properties[1],
    port: Number.parseInt(properties[2]),
    password: properties[3],
    protocol: properties[4]
  }

  // return fileContent

  return lcuProperties
}

export const pickClientPath = async (client: client): Promise<string> => {
  const dialogResult = await dialog.showOpenDialog({ properties: ['openFile'] })
  const settingsStore = await getStore()

  const clientPath = dialogResult.filePaths[0].replaceAll('\\', '/')
  let dirName = ''

  if (client === 'league') {
    if (!clientPath.includes('LeagueClient')) {
      throw new Error('path does not contain the league client')
    }

    dirName = path.dirname(clientPath)
    settingsStore.set('leagueClientPath', dirName)
  }

  if (client === 'riot') {
    if (!clientPath.includes('RiotClientServices')) {
      throw new Error('path does not contain the riot client')
    }

    dirName = path.dirname(clientPath)
    settingsStore.set('riotClientPath', dirName)
  }

  return dirName
}
