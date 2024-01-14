export interface LCUGameSettings {
  FloatingText: FloatingText
  General: General
  HUD: Hud
  LossOfControl: LossOfControl
  Performance: Performance
  Voice: Voice
  Volume: Volume
}

export interface FloatingText {
  Damage_Enabled: boolean
  Dodge_Enabled: boolean
  EnemyDamage_Enabled: boolean
  Experience_Enabled: boolean
  Gold_Enabled: boolean
  Heal_Enabled: boolean
  Invulnerable_Enabled: boolean
  Level_Enabled: boolean
  ManaDamage_Enabled: boolean
  QuestReceived_Enabled: boolean
  Score_Enabled: boolean
  Special_Enabled: boolean
}

export interface General {
  AutoAcquireTarget: boolean
  BindSysKeys: boolean
  CursorOverride: boolean
  CursorScale: number
  EnableAudio: boolean
  EnableTargetedAttackMove: boolean
  GameMouseSpeed: number
  HideEyeCandy: boolean
  OSXMouseAcceleration: boolean
  PredictMovement: boolean
  PreferDX9LegacyMode: boolean
  PreferOpenGLLegacyMode: boolean
  RecommendJunglePaths: boolean
  RelativeTeamColors: boolean
  ShowCursorLocator: boolean
  ShowGodray: boolean
  ShowTurretRangeIndicators: boolean
  SnapCameraOnRespawn: boolean
  ThemeMusic: number
  WaitForVerticalSync: boolean
  WindowMode: number
}

export interface Hud {
  AutoDisplayTarget: boolean
  CameraLockMode: number
  ChatChannelVisibility: number
  ChatScale: number
  DisableHudSpellClick: boolean
  DrawHealthBars: boolean
  EmotePopupUIDisplayMode: number
  EmoteSize: number
  EnableLineMissileVis: boolean
  EternalsMilestoneDisplayMode: number
  FlashScreenWhenDamaged: boolean
  FlashScreenWhenStunned: boolean
  FlipMiniMap: boolean
  GlobalScale: number
  KeyboardScrollSpeed: number
  MapScrollSpeed: number
  MiddleClickDragScrollEnabled: boolean
  MinimapMoveSelf: boolean
  MinimapScale: number
  MirroredScoreboard: boolean
  NumericCooldownFormat: number
  ObjectiveVoteScale: number
  ScrollSmoothingEnabled: boolean
  ShowAllChannelChat: boolean
  ShowAlliedChat: boolean
  ShowAttackRadius: boolean
  ShowNeutralCamps: boolean
  ShowOffScreenPointsOfInterest: boolean
  ShowSpellCosts: boolean
  ShowSpellRecommendations: boolean
  ShowSummonerNames: boolean
  ShowSummonerNamesInScoreboard: boolean
  ShowTeamFramesOnLeft: boolean
  ShowTimestamps: boolean
  SmartCastOnKeyRelease: boolean
  SmartCastWithIndicator_CastWhenNewSpellSelected: boolean
}

export interface LossOfControl {
  LossOfControlEnabled: boolean
  ShowSlows: boolean
}

export interface Performance {
  EnableHUDAnimations: boolean
}

export interface Voice {
  ShowVoiceChatHalos: boolean
  ShowVoicePanelWithScoreboard: boolean
}

export interface Volume {
  AmbienceMute: boolean
  AmbienceVolume: number
  AnnouncerMute: boolean
  AnnouncerVolume: number
  MasterMute: boolean
  MasterVolume: number
  MusicMute: boolean
  MusicVolume: number
  PingsMute: boolean
  PingsVolume: number
  SfxMute: boolean
  SfxVolume: number
  VoiceMute: boolean
  VoiceVolume: number
}

export default LCUGameSettings
