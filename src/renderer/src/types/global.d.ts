import { ProcessHandler } from './ProcessHandler'

declare global {
  interface Window {
    ProcessHandler: ProcessHandler
  }
}
