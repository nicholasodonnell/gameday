import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { add, sub } from 'date-fns'
import { format } from 'date-fns-tz'

import { Game, GameService } from '@/features/game'
import { Team, TeamId } from '@/features/team'

import { GuideTemplate, Program } from './types'

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
    const sevenDaysFromNow: Date = add(today, { days: 7 })

    const programs: Program[] = (
      await Promise.all<Program[]>(
        teams.map<Promise<Program[]>>(async (team: Team): Promise<Program[]> => {
          const games: Game[] = await this.game.getGamesInRange(team, today, sevenDaysFromNow)

          return games.map<Program>((game: Game) => {
            // buffer of 30 minutes before and after the game to account for pre-game and post-game content
            const programStartDate: Date = sub(game.startDate, { minutes: 30 })
            const programStopDate: Date = add(game.approximateEndDate, { minutes: 30 })

            return {
              game,
              start: format(programStartDate, 'yyyyMMddHHmmss XXX', { timeZone: TZ }).replace(/:/g, ''),
              stop: format(programStopDate, 'yyyyMMddHHmmss XXX', { timeZone: TZ }).replace(/:/g, ''),
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
