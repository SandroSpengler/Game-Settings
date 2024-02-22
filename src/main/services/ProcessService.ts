import cp from 'child_process'
import find from 'find-process'
import { kill } from 'process'

import { dialog } from 'electron'
import Store from 'electron-store'
import fs from 'fs'
import util from 'node:util'

import { client } from '../../renderer/src/types/ClientTypes'
import Process from '../../renderer/src/types/Process'
import SettingsStore, { StoreSettingsSchema } from '../../renderer/src/types/SettingsStore'

import os from 'node:os'
import path from 'path'
import LCUProperties from '../../renderer/src/interfaces/LCUProperties'
import { OSInformation } from '@renderer/types/OSInformation'

export const launchProcess = async (clientCount: number): Promise<Process> => {
  const launchArgs: string[] = ['--launch-product=league_of_legends', '--launch-patchline=live']
  const settingsStore = await getStore()
  const osInfo = getOSInformation()

  if (clientCount > 0) {
    launchArgs.push('--allow-multiple-clients')
  }

  const platformPath =
    osInfo.platform === 'win32'
      ? `${settingsStore.store.riotClientPath}/RiotClientServices.exe`
      : `${settingsStore.store.riotClientPath}/Riot Client.app/Contents/MacOS/RiotClientServices`

  const lolClient = cp.spawn(platformPath, launchArgs, {
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

  const osInfo = getOSInformation()

  let runningProcesses: Awaited<ReturnType<typeof find>> = []

  if (osInfo.platform === 'win32') {
    runningProcesses = await find('name', 'LeagueClient.exe')
  }

  if (osInfo.platform === 'darwin') {
    runningProcesses = await find('name', 'LeagueClient')
  }

  if (osInfo.platform === 'linux') {
    return []
  }

  const runningClients: Process[] = runningLolClients

  if (runningProcesses.length === 0) {
    return runningClients
  }

  for (const process of runningProcesses) {
    if (osInfo.platform === 'win32') {
      if (process.name === 'LeagueClientUx.exe') {
        continue
      }
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const binPath = (process as any).bin || ''

    const client: Process = {
      cmd: [process.cmd],
      pid: process.pid,
      name: process.name,
      bin: binPath
    }

    if (osInfo.platform === 'darwin') {
      if (!client.bin?.endsWith('LeagueClient')) {
        continue
      }
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
  const osInfo = getOSInformation()

  const settingsStore = await getStore()

  const leagueInstallPath = settingsStore.get('leagueClientPath')

  const validPath = isValidLCUPath(leagueInstallPath, osInfo.platform === 'darwin')

  if (!validPath) {
    // TODO
    // check the default install path for each os

    settingsStore.set('leagueClientPath', '')

    throw new Error('could not determine client path automatically')
  }

  settingsStore.set('leagueClientPath', leagueInstallPath)

  return settingsStore.store.leagueClientPath
}

export const determineLeagueClientPath = async (): Promise<string> => {
  const osInfo = getOSInformation()
  const settingsStore = await getStore()

  const leagueInstallPath = await getLCUPathFromProcess(osInfo.platform)

  if (settingsStore.get('leagueClientPath') === leagueInstallPath) {
    return settingsStore.get('leagueClientPath')
  }

  const validPath = isValidLCUPath(leagueInstallPath, osInfo.platform === 'darwin')

  if (!validPath) {
    settingsStore.set('leagueClientPath', '')

    throw new Error('could not determine client path automatically')
  }

  settingsStore.set('leagueClientPath', leagueInstallPath)

  return settingsStore.store.leagueClientPath
}

export const getRiotClientInstallPath = async (): Promise<string> => {
  const osInfo = getOSInformation()

  const settingsStore = await getStore()

  const riotClientInstallPath = settingsStore.get('riotClientPath')

  const validPath = isValidRiotClientPathPath(riotClientInstallPath, osInfo.platform === 'darwin')

  if (!validPath) {
    // TODO
    // check the default install path for each os

    settingsStore.set('riotClientPath', '')

    throw new Error('could not determine client path automatically')
  }

  settingsStore.set('riotClientPath', riotClientInstallPath)

  return settingsStore.store.riotClientPath
}

export const getStore = async (): Promise<Store<SettingsStore>> => {
  // TODO
  // Handle validation error -> store corrupt -> reset store
  const store = new Store({ schema: StoreSettingsSchema })

  return store
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

  return lcuProperties
}

export const pickClientPath = async (client: client): Promise<string> => {
  const dialogResult = await dialog.showOpenDialog({ properties: ['openFile'] })
  const settingsStore = await getStore()
  const osInfo = getOSInformation()

  const clientPath = dialogResult.filePaths[0]
  // .replaceAll('\\', '/')
  let dirName = ''

  if (client === 'league') {
    let applicationName = ''

    switch (osInfo.platform) {
      case 'win32':
        applicationName = 'LeagueClient'
        break
      case 'darwin':
        applicationName = 'League of Legends.app'
        break
      case 'linux':
        break
      default:
        break
    }

    if (!clientPath.includes(applicationName)) {
      throw new Error('path does not contain the league client')
    }

    if (osInfo.platform === 'darwin') {
      // League of Legends.app/Contents/LoL

      dirName = path.dirname(clientPath)
      settingsStore.set('leagueClientPath', dirName)

      const macPath = dirName + '/League of Legends.app/Contents/LoL'

      settingsStore.set('leagueClientPath', macPath)

      return macPath
    }

    dirName = path.dirname(clientPath)
    settingsStore.set('leagueClientPath', dirName)
  }

  if (client === 'riot') {
    let applicationName = ''

    switch (osInfo.platform) {
      case 'win32':
        applicationName = 'RiotClientServices'
        break
      case 'darwin':
        applicationName = 'Riot Client.app'
        break
      case 'linux':
        break
      default:
        break
    }

    if (!clientPath.includes(applicationName)) {
      throw new Error('path does not contain the riot client')
    }

    dirName = path.dirname(clientPath)
    settingsStore.set('riotClientPath', dirName)
  }

  return dirName
}

/**
 * This entire method is mostly from lcu-connector.
 * This npm package  determines the install path of a running client and read the lcu properties
 * In this project the install path is required in it's entirety.
 *
 * Please take a look at the lcu-connector, if you only require the lcu properties
 * @see https://github.com/Pupix/lcu-connector/tree/master
 *
 */
export const getLCUPathFromProcess = async (platform: string): Promise<string | undefined> => {
  const IS_WIN = platform === 'win32'
  // const IS_MAC = process.platform === 'darwin'
  const IS_WSL = platform === 'linux' && os.release().toLowerCase().includes('microsoft')

  const INSTALL_REGEX_WIN = /"--install-directory=(.*?)"/
  const INSTALL_REGEX_MAC = /--install-directory=(.*?)( --|\n|$)/
  const INSTALL_REGEX = IS_WIN || IS_WSL ? INSTALL_REGEX_WIN : INSTALL_REGEX_MAC

  // new function -> determine running LeagueClients
  const command = IS_WIN
    ? `WMIC PROCESS WHERE name='LeagueClientUx.exe' GET commandline`
    : IS_WSL
    ? `WMIC.exe PROCESS WHERE "name='LeagueClientUx.exe'" GET commandline`
    : `ps x -o args | grep 'LeagueClientUx'`

  const execPromise = util.promisify(cp.exec)

  const result = await execPromise(command)

  const parts = result.stdout.match(INSTALL_REGEX) || []
  const dirPath = !IS_WSL
    ? parts[1]
    : parts[1]
        .split(path.win32.sep)
        .join(path.sep)
        .replace(/^([a-zA-Z]):/, (match) => '/mnt/' + match[0].toLowerCase())

  return dirPath
}

export const isValidLCUPath = (dirPath: string | undefined, isMac: boolean): boolean => {
  if (!dirPath) {
    return false
  }

  const lcuClientApp = isMac ? 'LeagueClient.app' : 'LeagueClient.exe'
  const common =
    fs.existsSync(path.join(dirPath, lcuClientApp)) && fs.existsSync(path.join(dirPath, 'Config'))

  const isGlobal = common && fs.existsSync(path.join(dirPath, 'RADS'))
  const isCN = common && fs.existsSync(path.join(dirPath, 'TQM'))
  const isGarena = common // Garena has no other

  return isGlobal || isCN || isGarena
}

export const isValidRiotClientPathPath = (dirPath: string | undefined, isMac: boolean): boolean => {
  if (!dirPath) {
    return false
  }

  const lcuClientApp = isMac ? 'Riot Client.app' : 'RiotClientServices.exe'
  const common = fs.existsSync(path.join(dirPath, lcuClientApp))

  // const isGlobal = common && fs.existsSync(path.join(dirPath, 'RADS'))
  // const isCN = common && fs.existsSync(path.join(dirPath, 'TQM'))
  // const isGarena = common // Garena has no other

  return common
}

// TODO:
// Custom types
export const getOSInformation = (): OSInformation => {
  const type = os.type()
  const platform = os.platform()

  return { type: type, platform: platform }
}
