import { ProcessHandler } from './ProcessHandler'

declare global {
  const APP_VERSION: string
  interface Window {
    ProcessHandler: ProcessHandler
  }
}
