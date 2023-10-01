import { LolSummonerSummoner } from '@renderer/interfaces/LCUClient'
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
