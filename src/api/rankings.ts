import { API_URL, buildUrl } from "./helpers.ts"

// Query Params Available for this endpoint
export type RankingQueryParams = {
  country?: string
  with_players?: boolean
  precalculate?: boolean
  include_old?: boolean
}

// Auxiliary Types
type LeaderboardSums = {
  by_tr: { tr: number; apm: number; pps: number; vs: number }
  by_glicko: { glicko: number; apm: number; pps: number; vs: number }
}

type LeaderboardVariations = {
  tr: number; glicko: number
}

// Base Types
type BaseLeaderboardPlayer = {
  _id: string
  rank_tr: number
  rank_glicko: number
  username: string
  country: string
  league: {
    glicko: number; tr: number; rank: string; apm: number; pps: number; vs: number
  }
}

type BaseCountryLeaderboard = {
  key: number
  country: string
  last_updated: string
  player_count: number
  left_leaderboard: BaseLeaderboardPlayer[]
  joined_leaderboard: BaseLeaderboardPlayer[]
  total_tr: number
  total_glicko: number
}

// Conditional Types.

// Player: Agrega `variations` solo si precalculate es true
type LeaderboardPlayer<T extends RankingQueryParams> = BaseLeaderboardPlayer &
  (T["precalculate"] extends true
    ? { variations: { tr: number; glicko: number; pps: number; apm: number; vs: number } }
    : {})

// CountryLeaderboard: Agrega `players`, `sums` y `variations` según los flags
type CountryLeaderboard<T extends RankingQueryParams> = BaseCountryLeaderboard &
  (T["with_players"] extends true
    ? { players: LeaderboardPlayer<T>[] }
    : {}) &
  (T["precalculate"] extends true
    ? {
      sums: { top_10: LeaderboardSums; top_25: LeaderboardSums; top_100: LeaderboardSums }
      variations: { top_10: LeaderboardVariations; top_25: LeaderboardVariations; top_100: LeaderboardVariations }
    } 
    : {})

// Response: Agrega `oldLeaderboards` solo si include_old es true
type RankingLeaderboardResponse<T extends RankingQueryParams> = {
  latestLeaderboards: CountryLeaderboard<T>[]
} & (T["include_old"] extends true
  ? { oldLeaderboards: CountryLeaderboard<T>[] }
  : {})


const Endpoint = {
  get: (params?: RankingQueryParams) => `${API_URL}/api/country_rankings${buildUrl("", params)}`
}

export const RankingsAPI = {

  get: async <T extends RankingQueryParams = {}>(params?: T & RankingQueryParams) => {
    return await fetch(Endpoint.get(params), { method: "GET" })
      .then(res => res.json()) as Promise<RankingLeaderboardResponse<T>>
  }
}