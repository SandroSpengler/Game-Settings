import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { checkForRunningLolClients, stopProcess } from '../main/services/ProcessService'

import ProcessHandler from '../renderer/src/types/ProcessHandler'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)

    const ProcessHandler: ProcessHandler = {
      stopProcess: stopProcess,
      checkForRunningLolClients: checkForRunningLolClients,

      // use electron node api from the main process
      determineLeagueClientInstallPath: () => ipcRenderer.invoke('determineLeagueClientPath'),
      launchProcess: (clientCount) => ipcRenderer.invoke('launchProcess', clientCount),
      pickClientPath: (client) => ipcRenderer.invoke('pickClientPath', client),
      getLeagueClientInstallPath: () => ipcRenderer.invoke('getLeagueClientPath'),
      getRiotClientInstallPath: () => ipcRenderer.invoke('getRiotClientPath'),
      getOsInformation: () => ipcRenderer.invoke('getOSInformation'),
      readLCUProperties: () => ipcRenderer.invoke('readLCUProperties'),
      getStore: () => ipcRenderer.invoke('getStore'),
      importFile: () => ipcRenderer.invoke('importFile')
    }

    contextBridge.exposeInMainWorld('ProcessHandler', ProcessHandler)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
