export interface LCUInputSettings {
  GameEvents: GameEvents
  HUDEvents: Hudevents
  Quickbinds: Quickbinds
  ShopEvents: ShopEvents
}

export interface GameEvents {
  evntPlayerPing: string
  evntPlayerPingCursor: string
  evntPlayerPingCursorDanger: string
  evntPlayerPingDanger: string
  evtCameraLockToggle: string
  evtCameraSnap: string
  evtCastAvatarSpell1: string
  evtCastAvatarSpell2: string
  evtCastSpell1: string
  evtCastSpell2: string
  evtCastSpell3: string
  evtCastSpell4: string
  evtChampMasteryDisplay: string
  evtChampionOnly: string
  evtChatHistory: string
  evtDragScrollLock: string
  evtDrawHud: string
  evtEmoteDance: string
  evtEmoteJoke: string
  evtEmoteLaugh: string
  evtEmoteTaunt: string
  evtEmoteToggle: string
  evtLevelSpell1: string
  evtLevelSpell2: string
  evtLevelSpell3: string
  evtLevelSpell4: string
  evtNormalCastAvatarSpell1: string
  evtNormalCastAvatarSpell2: string
  evtNormalCastItem1: string
  evtNormalCastItem2: string
  evtNormalCastItem3: string
  evtNormalCastItem4: string
  evtNormalCastItem5: string
  evtNormalCastItem6: string
  evtNormalCastSpell1: string
  evtNormalCastSpell2: string
  evtNormalCastSpell3: string
  evtNormalCastSpell4: string
  evtNormalCastVisionItem: string
  evtOnUIMouse4Pan: string
  evtOpenShop: string
  evtPetMoveClick: string
  evtPlayerAttackMove: string
  evtPlayerAttackMoveClick: string
  evtPlayerAttackOnlyClick: string
  evtPlayerHoldPosition: string
  evtPlayerMoveClick: string
  evtPlayerPingAllIn: string
  evtPlayerPingComeHere: string
  evtPlayerPingMIA: string
  evtPlayerPingOMW: string
  evtPlayerPingPush: string
  evtPlayerPingRadialDanger: string
  evtPlayerPingVisionNeeded: string
  evtPlayerStopPosition: string
  evtPushToTalk: string
  evtRadialEmoteInstantOpen: string
  evtRadialEmoteOpen: string
  evtRadialEmotePlaySlot0: string
  evtRadialEmotePlaySlot1: string
  evtRadialEmotePlaySlot2: string
  evtRadialEmotePlaySlot3: string
  evtRadialEmotePlaySlot4: string
  evtRadialEmotePlaySlot5: string
  evtRadialEmotePlaySlot6: string
  evtRadialEmotePlaySlot7: string
  evtRadialEmotePlaySlot8: string
  evtReciprocityTrigger: string
  evtScrollDown: string
  evtScrollLeft: string
  evtScrollRight: string
  evtScrollUp: string
  evtSelectAlly1: string
  evtSelectAlly2: string
  evtSelectAlly3: string
  evtSelectAlly4: string
  evtSelectSelf: string
  evtSelfCastAvatarSpell1: string
  evtSelfCastAvatarSpell2: string
  evtSelfCastItem1: string
  evtSelfCastItem2: string
  evtSelfCastItem3: string
  evtSelfCastItem4: string
  evtSelfCastItem5: string
  evtSelfCastItem6: string
  evtSelfCastSpell1: string
  evtSelfCastSpell2: string
  evtSelfCastSpell3: string
  evtSelfCastSpell4: string
  evtSelfCastVisionItem: string
  evtShowCharacterMenu: string
  evtShowHealthBars: string
  evtShowScoreBoard: string
  evtShowSummonerNames: string
  evtShowVoicePanel: string
  evtSmartCastAvatarSpell1: string
  evtSmartCastAvatarSpell2: string
  evtSmartCastItem1: string
  evtSmartCastItem2: string
  evtSmartCastItem3: string
  evtSmartCastItem4: string
  evtSmartCastItem5: string
  evtSmartCastItem6: string
  evtSmartCastSpell1: string
  evtSmartCastSpell2: string
  evtSmartCastSpell3: string
  evtSmartCastSpell4: string
  evtSmartCastVisionItem: string
  evtSmartCastWithIndicatorAvatarSpell1: string
  evtSmartCastWithIndicatorAvatarSpell2: string
  evtSmartCastWithIndicatorItem1: string
  evtSmartCastWithIndicatorItem2: string
  evtSmartCastWithIndicatorItem3: string
  evtSmartCastWithIndicatorItem4: string
  evtSmartCastWithIndicatorItem5: string
  evtSmartCastWithIndicatorItem6: string
  evtSmartCastWithIndicatorSpell1: string
  evtSmartCastWithIndicatorSpell2: string
  evtSmartCastWithIndicatorSpell3: string
  evtSmartCastWithIndicatorSpell4: string
  evtSmartCastWithIndicatorVisionItem: string
  evtSmartPlusSelfCastAvatarSpell1: string
  evtSmartPlusSelfCastAvatarSpell2: string
  evtSmartPlusSelfCastItem1: string
  evtSmartPlusSelfCastItem2: string
  evtSmartPlusSelfCastItem3: string
  evtSmartPlusSelfCastItem4: string
  evtSmartPlusSelfCastItem5: string
  evtSmartPlusSelfCastItem6: string
  evtSmartPlusSelfCastSpell1: string
  evtSmartPlusSelfCastSpell2: string
  evtSmartPlusSelfCastSpell3: string
  evtSmartPlusSelfCastSpell4: string
  evtSmartPlusSelfCastVisionItem: string
  evtSmartPlusSelfCastWithIndicatorAvatarSpell1: string
  evtSmartPlusSelfCastWithIndicatorAvatarSpell2: string
  evtSmartPlusSelfCastWithIndicatorItem1: string
  evtSmartPlusSelfCastWithIndicatorItem2: string
  evtSmartPlusSelfCastWithIndicatorItem3: string
  evtSmartPlusSelfCastWithIndicatorItem4: string
  evtSmartPlusSelfCastWithIndicatorItem5: string
  evtSmartPlusSelfCastWithIndicatorItem6: string
  evtSmartPlusSelfCastWithIndicatorSpell1: string
  evtSmartPlusSelfCastWithIndicatorSpell2: string
  evtSmartPlusSelfCastWithIndicatorSpell3: string
  evtSmartPlusSelfCastWithIndicatorSpell4: string
  evtSmartPlusSelfCastWithIndicatorVisionItem: string
  evtSysMenu: string
  evtToggleMinionHealthBars: string
  evtUseItem1: string
  evtUseItem2: string
  evtUseItem3: string
  evtUseItem4: string
  evtUseItem5: string
  evtUseItem6: string
  evtUseItem7: string
  evtUseVisionItem: string
}

export interface Hudevents {
  evtHoldShowScoreBoard: string
  evtToggleDeathRecapShowcase: string
  evtToggleFPSAndLatency: string
  evtToggleMouseClip: string
  evtTogglePlayerStats: string
}

export interface Quickbinds {
  evtCastAvatarSpell1smart: boolean
  evtCastAvatarSpell2smart: boolean
  evtCastSpell1smart: boolean
  evtCastSpell2smart: boolean
  evtCastSpell3smart: boolean
  evtCastSpell4smart: boolean
  evtUseItem1smart: boolean
  evtUseItem2smart: boolean
  evtUseItem3smart: boolean
  evtUseItem4smart: boolean
  evtUseItem5smart: boolean
  evtUseItem6smart: boolean
  evtUseVisionItemsmart: boolean
}

export interface ShopEvents {
  evtShopFocusSearch: string
  evtShopSwitchTabs: string
}
