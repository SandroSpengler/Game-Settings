import { LolSummonerSummoner } from '@renderer/interfaces/LCUClient'
import LCUGameSettings from '@renderer/interfaces/LCUGameSettings'
import { LCUInputSettings } from '@renderer/interfaces/LCUInputSettings'
import LCUProperties from '@renderer/interfaces/LCUProperties'

export const getSummoner = async (lcuProperties: LCUProperties): Promise<LolSummonerSummoner> => {
  const authHeader = btoa(`riot:${lcuProperties.password}`)

  const request = await fetch(
    `${lcuProperties.protocol}://127.0.0.1:${lcuProperties.port}/lol-summoner/v1/current-summoner`,
    {
      headers: {
        Authorization: `Basic ${authHeader}`
      }
    }
  )

  const summonerInfo: LolSummonerSummoner = await request.json()

  return summonerInfo
}

export const getGameSettings = async (lcuProperties: LCUProperties): Promise<LCUGameSettings> => {
  const authHeader = btoa(`riot:${lcuProperties.password}`)

  const request = await fetch(
    `${lcuProperties.protocol}://127.0.0.1:${lcuProperties.port}/lol-game-settings/v1/game-settings`,
    {
      headers: {
        Authorization: `Basic ${authHeader}`
      }
    }
  )

  const gameSettings: LCUGameSettings = await request.json()

  return gameSettings
}

export const getInputSettings = async (lcuProperties: LCUProperties): Promise<LCUInputSettings> => {
  const authHeader = btoa(`riot:${lcuProperties.password}`)

  const request = await fetch(
    `${lcuProperties.protocol}://127.0.0.1:${lcuProperties.port}/lol-game-settings/v1/input-settings`,
    {
      headers: {
        Authorization: `Basic ${authHeader}`
      }
    }
  )

  const gameSettings: LCUInputSettings = await request.json()

  return gameSettings
}

export const patchInputSettings = async (
  lcuProperties: LCUProperties,
  gameSettings: LCUInputSettings | (LCUGameSettings & LCUInputSettings)
): Promise<void> => {
  const authHeader = btoa(`riot:${lcuProperties.password}`)

  const request = await fetch(
    `${lcuProperties.protocol}://127.0.0.1:${lcuProperties.port}/lol-game-settings/v1/input-settings`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gameSettings)
    }
  )

  await request.json()
}

export const patchGameSettings = async (
  lcuProperties: LCUProperties,
  gameSettings: LCUGameSettings | (LCUGameSettings & LCUInputSettings)
): Promise<void> => {
  const authHeader = btoa(`riot:${lcuProperties.password}`)

  const request = await fetch(
    `${lcuProperties.protocol}://127.0.0.1:${lcuProperties.port}/lol-game-settings/v1/game-settings`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gameSettings)
    }
  )

  await request.json()
}
