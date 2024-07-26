import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

import { Game, GameException, NoLiveGameException } from './types'

import { Epg, MastApiService, VideoFeed } from '@/clients/mastapi'
import { Team, TeamId, TeamName, TeamNotFoundException } from '@/features/team'

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name)

  constructor(
    private readonly config: ConfigService,
    private readonly mastApi: MastApiService,
  ) {}

  public async getGamesInRange(team: Team, startDate: Date, endDate: Date): Promise<Game[]> {
    try {
      const teamId: TeamId | undefined = TeamId[team]
      const tz: string = this.config.getOrThrow<string>('TZ')
      const zonedStartDate: Date = toZonedTime(startDate, tz)
      const zonedEndDate: Date = toZonedTime(endDate, tz)
      const formattedStartDate: string = format(zonedStartDate, 'yyyy-MM-dd')
      const formattedEndDate: string = format(zonedEndDate, 'yyyy-MM-dd')

      this.logger.log({ endDate: formattedEndDate, startDate: formattedStartDate, team }, `Searching for games...`)

      if (!teamId) {
        throw new TeamNotFoundException()
      }

      const epgs: Epg[] = await this.mastApi.searchEpg(teamId, startDate, endDate)

      this.logger.debug(
        { endDate: formattedEndDate, startDate: formattedStartDate, teamId },
        `Received ${epgs?.length} epg(s) from MLB`,
      )

      return (
        epgs.reduce<Game[]>((games, { gameData, videoFeeds }) => {
          const targetVideoFeeds: VideoFeed[] = videoFeeds.filter((videoFeed) => videoFeed.mediaFeedSubType === teamId)
          const homeTeamId: TeamId = gameData.home.teamId.toString() as TeamId
          const homeTeam: Team = Object.keys(TeamId)[Object.values(TeamId).indexOf(homeTeamId)] as Team
          const awayTeamId: TeamId = gameData.away.teamId.toString() as TeamId
          const awayTeam = Object.keys(TeamId)[Object.values(TeamId).indexOf(awayTeamId)] as Team
          const opponent: Team = team === homeTeam ? awayTeam : homeTeam
          const startDate: Date = new Date(gameData.gameDate)
          const approximateEndDate: Date = new Date(startDate.valueOf() + 3 * 60 * 60 * 1000) // start date + 3 hours
          const zonedStartDate: Date = toZonedTime(startDate, tz)

          const epgGames = targetVideoFeeds.map<Game>((videoFeed) => ({
            approximateEndDate,
            blackedOut: videoFeed.blackedOut,
            freeGame: videoFeed.freeGame,
            mediaFeedType: videoFeed.mediaFeedType as Game['mediaFeedType'],
            mediaId: videoFeed.mediaId,
            mediaState: videoFeed.mediaState as Game['mediaState'],
            opponent,
            startDate,
            team,
            title: `${TeamName[team]} vs. ${TeamName[opponent]} (${format(zonedStartDate, 'MMM d h:mm a')})`,
          }))

          return [...games, ...epgGames]
        }, []) ?? []
      )
    } catch (cause) {
      throw new GameException('Failed to get games', { cause, endDate, startDate, team })
    }
  }

  public async getGamesOnDay(team: Team, date: Date): Promise<Game[]> {
    return await this.getGamesInRange(team, date, date)
  }

  public async getLiveGame(team: Team): Promise<Game> {
    try {
      const today: Date = new Date(Date.now())
      const tz: string = this.config.getOrThrow<string>('TZ')
      const formattedDate: string = format(toZonedTime(today, tz), 'yyyy-MM-dd')
      const todaysGames: Game[] = await this.getGamesOnDay(team, today)

      this.logger.log({ date: formattedDate, team, tz }, `Searching for a live game...`)

      if (todaysGames.length === 0) {
        this.logger.warn({ date: formattedDate, team }, 'No scheduled games today')

        throw new NoLiveGameException('No scheduled games today', { date: formattedDate, team })
      }

      const liveGame: Game | undefined = todaysGames.find((game) => game.mediaState === 'MEDIA_ON')

      this.logger.debug({ date: formattedDate, team, ...liveGame }, `Found ${liveGame ? 'live' : 'no live'} game`)

      if (!liveGame) {
        this.logger.warn({ date: formattedDate, team }, 'No live game found')
        throw new NoLiveGameException('No live game found', { date: formattedDate, team })
      }

      return liveGame
    } catch (cause) {
      if (cause instanceof GameException) {
        throw cause
      }

      throw new GameException('Failed to get live game', { cause })
    }
  }
}
