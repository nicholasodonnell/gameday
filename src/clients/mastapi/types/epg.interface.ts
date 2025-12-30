export interface AudioFeed {
  callLetters: string
  contentId: string
  entitled: boolean
  language: string
  mediaFeedSubType: string
  mediaId: string
  mediaState: string
  type: string
}

export interface Epg {
  audioFeeds: AudioFeed[]
  blackedOutVideo: boolean
  entitledAudio: boolean
  entitledVideo: boolean
  gameData: GameData
  gamePk: string
  prePostShows: PrePostShows
  videoFeeds: VideoFeed[]
  videoStatusCodes: number[]
}

export interface GameData {
  abstractGameCode: string
  abstractGameState: string
  away: Team
  codedGameState: string
  currentBalls: number
  currentBatterAtBats: number
  currentBatterHits: number
  currentBatterId: number
  currentBatterLastName: string
  currentBatterOps: string
  currentInning: number
  currentInningState: string
  currentOuts: number
  currentPitcherEra: string
  currentPitcherId: number
  currentPitcherInningsPitched: string
  currentPitcherLastName: string
  currentStrikes: number
  detailedState: string
  doubleHeader: string
  freeGame: boolean
  gameDate: string
  gameNumber: number
  gamePk: number
  gameType: string
  home: Team
  isTopInning: boolean
  noHitter: boolean
  onFirst: boolean
  onSecond: boolean
  onThird: boolean
  perfectGame: boolean
  scheduledInnings: number
  startTimeTBD: boolean
  statusCode: string
  venueId: number
}

export interface Hero {
  live: boolean
}

export interface PreGamePostGame {
  hasShow: boolean
  startTime?: string
}

export interface PrePostShows {
  away: ShowDetails
  home: ShowDetails
}

export interface SearchEpgResponse {
  featured: unknown[]
  hero: Hero
  results: Epg[]
}

export interface ShowDetails {
  contentId: string
  postGame: PreGamePostGame
  preGame: PreGamePostGame
  streamState: string
}

export interface Team {
  losses: number
  probablePitcherEra: string
  probablePitcherId: number
  probablePitcherLastName: string
  probablePitcherLosses: number
  probablePitcherWins: number
  runs: number
  splitSquad: boolean
  teamAbbrv: string
  teamId: number
  teamName: string
  wins: number
}

export interface VideoFeed {
  abcAuthRequired: boolean
  blackedOut: boolean
  callLetters: string
  contentId: string
  entitled: boolean
  espn2AuthRequired: boolean
  espnAuthRequired: boolean
  foxAuthRequired: boolean
  freeGame: boolean
  fs1AuthRequired: boolean
  inMarket: boolean
  mediaFeedSubType: string
  mediaFeedType: string
  mediaId: string
  mediaState: string
  mlbnAuthRequired: boolean
  tbsAuthRequired: boolean
}
