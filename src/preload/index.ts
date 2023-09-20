import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ProcessHandler } from '../main/types/ProcessHandler'
import {
  checkForRunningLolClients,
  launchProcess,
  stopProcess
} from '../main/services/ProcessService'

// import kill from "tree-kill";

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
      launchProcess: launchProcess,
      stopProcess: stopProcess,
      checkForRunningLolClients: checkForRunningLolClients
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
