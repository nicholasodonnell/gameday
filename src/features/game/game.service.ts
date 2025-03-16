import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

import { Game, GameException, NoLiveGameException } from './types'

import { Epg, MastApiService, VideoFeed } from '@/clients/mastapi'
import { ApplicationException } from '@/common/errors'
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

      if (!teamId) {
        throw new TeamNotFoundException()
      }

      const epgs: Epg[] = await this.mastApi.searchEpg(teamId, startDate, endDate)

      this.logger.debug(
        { endDate: formattedEndDate, startDate: formattedStartDate, teamId },
        `Received ${epgs?.length} epg(s) from MLB for ${team}`,
      )

      return (
        epgs.reduce<Game[]>((games, { gameData, videoFeeds }) => {
          // target video feeds from the desired team's station (e.g. MASN for BAL)
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
            description: `${TeamName[awayTeam]} take on ${TeamName[homeTeam]} with first pitch at ${format(zonedStartDate, 'h:mm a')}`,
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
      if (cause instanceof ApplicationException) {
        throw cause
      }

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
      const formattedToday: string = format(toZonedTime(today, tz), 'yyyy-MM-dd')
      const todaysGames: Game[] = await this.getGamesOnDay(team, today)

      if (todaysGames.length === 0) {
        this.logger.warn({ date: formattedToday, team }, `No scheduled games today for ${team}`)

        throw new NoLiveGameException('No scheduled games today', { date: formattedToday, team })
      }

      const liveGame: Game | undefined = todaysGames.find((game) => game.mediaState === 'MEDIA_ON')

      if (!liveGame) {
        this.logger.warn({ date: formattedToday, team }, `No live game found for ${team}`)

        throw new NoLiveGameException('No live game found', { date: formattedToday, team })
      }

      this.logger.log({ date: formattedToday, game: liveGame, team }, `Got live game for ${team}`)

      return liveGame
    } catch (cause) {
      if (cause instanceof ApplicationException) {
        throw cause
      }

      throw new GameException('Failed to get live game', { cause })
    }
  }
}
