import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { format } from 'date-fns-tz'

import { GuideTemplate } from './types'

import { ApplicationException } from '@/common/errors'
import { Game, GameService } from '@/features/game'
import { Team, TeamId } from '@/features/team'

@Injectable()
export class GuideService {
  private readonly logger = new Logger(GuideService.name)

  constructor(
    private readonly config: ConfigService,
    private readonly game: GameService,
  ) {}

  private async generatePrograms(): Promise<string> {
    try {
      const appUrl: string = this.config.getOrThrow<string>('APP_URL')
      const timeZone: string = this.config.getOrThrow<string>('TZ')
      const teams = Object.keys(TeamId) as Team[]
      const today: Date = new Date(Date.now())
      const sevenDaysFromNow: Date = new Date(today.valueOf() + 7 * 24 * 60 * 60 * 1000)

      const programs: string[] = (
        await Promise.all<string[]>(
          teams.map<Promise<string[]>>(async (team: Team): Promise<string[]> => {
            const games: Game[] = await this.game.getGamesInRange(team, today, sevenDaysFromNow)

            return games.map<string>((game: Game) => {
              const startDate: Date = new Date(game.startDate.valueOf() - 60 * 60 * 1000) // start date - 1 hour
              const stopDate: Date = new Date(game.approximateEndDate.valueOf() + 60 * 60 * 1000) // end date + 1 hour
              const formattedStartDate: string = format(startDate, 'yyyyMMddHHmmss XXX', { timeZone }).replace(/:/g, '')
              const formattedStopDate: string = format(stopDate, 'yyyyMMddHHmmss XXX', { timeZone }).replace(/:/g, '')

              return `
                <programme start="${formattedStartDate}" stop="${formattedStopDate}" channel="mlb-${team.toLowerCase()}">
                  <title>${game.title}</title>
                  <category lang="en">Sports</category>
                  <category lang="en">Baseball</category>
                  <category lang="en">Sports event</category>
                  <new />
                  <live />
                  <icon src="${appUrl}/playlist/logo/${team}.png" />
                </programme>
              `
            })
          }),
        )
      ).flat()

      return programs.join('\n')
    } catch (cause) {
      throw new ApplicationException('Failed to generate guide', { cause })
    }
  }

  public async getGuide(): Promise<GuideTemplate> {
    this.logger.log('Fetching guide...')

    const programs = await this.generatePrograms()

    this.logger.log('Guide generated successfully')

    return {
      programs,
    }
  }
}
