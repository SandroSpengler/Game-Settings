import { LolSummonerSummoner } from '@renderer/interfaces/LCUClient'
import LCUGameSettings from '@renderer/interfaces/LCUClientSettings'
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
