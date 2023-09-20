import { Schema } from 'electron-store'

export default interface SettingsStore {
  leagueClientPath: string
  riotClientPath: string
}

export const StoreSettingsSchema: Schema<SettingsStore> = {
  leagueClientPath: {
    type: 'string',
    default: ''
  },
  riotClientPath: {
    type: 'string',
    default: ''
  }
}
