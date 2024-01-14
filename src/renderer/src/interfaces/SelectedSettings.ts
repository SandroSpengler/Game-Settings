export interface SelectedGameSettings {
  AllGameSettings?: boolean
  FloatingText: boolean
  General: boolean
  HUD: boolean
  LossOfControl: boolean
  Performance: boolean
  Voice: boolean
  Volume: boolean
}

export type selectedGameSettingsKeys = keyof SelectedGameSettings

export interface SelectedInputSettings {
  AllInputSettings?: boolean
  GameEvents: boolean
  HUDEvents: boolean
  Quickbinds: boolean
  ShopEvents: boolean
}

export type selectedInputSettingsKeys = keyof SelectedInputSettings

export interface selectedSettings extends SelectedGameSettings, SelectedInputSettings {}

export type selectedSettingsKeys = keyof selectedSettings
