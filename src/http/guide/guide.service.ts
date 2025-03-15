import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { format } from 'date-fns-tz'

import { GuideTemplate, Program } from './types'

import { Game, GameService } from '@/features/game'
import { Team, TeamId } from '@/features/team'

@Injectable()
export class GuideService {
  constructor(
    private readonly config: ConfigService,
    private readonly game: GameService,
  ) {}

  public async getGuideTemplate(): Promise<GuideTemplate> {
    const APP_URL: string = this.config.getOrThrow<string>('APP_URL')
    const TZ: string = this.config.getOrThrow<string>('TZ')
    const teams = Object.keys(TeamId) as Team[]
    const today: Date = new Date(Date.now())
    const sevenDaysFromNow: Date = new Date(today.valueOf() + 7 * 24 * 60 * 60 * 1000)

    const programs: Program[] = (
      await Promise.all<Program[]>(
        teams.map<Promise<Program[]>>(async (team: Team): Promise<Program[]> => {
          const games: Game[] = await this.game.getGamesInRange(team, today, sevenDaysFromNow)

          return games.map<Program>((game: Game) => {
            const startDate: Date = new Date(game.startDate.valueOf() - 60 * 60 * 1000) // start date - 1 hour
            const stopDate: Date = new Date(game.approximateEndDate.valueOf() + 60 * 60 * 1000) // end date + 1 hour
            const formattedStartDate: string = format(startDate, 'yyyyMMddHHmmss XXX', { timeZone: TZ }).replace(
              /:/g,
              '',
            )
            const formattedStopDate: string = format(stopDate, 'yyyyMMddHHmmss XXX', { timeZone: TZ }).replace(/:/g, '')

            return {
              game,
              start: formattedStartDate,
              stop: formattedStopDate,
              team,
            }
          })
        }),
      )
    ).flat()

    return {
      APP_URL,
      programs,
    }
  }
}
