import { Injectable, Logger } from '@nestjs/common'

import { Team, TeamId, TeamNotFoundException } from './types'

import { MlbStaticService } from '@/clients/mlbstatic'

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name)

  constructor(private readonly mlbStatic: MlbStaticService) {}

  public async getLogo(team: Team): Promise<Buffer> {
    const teamId: TeamId | undefined = TeamId[team]

    if (!teamId) {
      throw new TeamNotFoundException()
    }

    this.logger.debug({ team, teamId }, `Got logo for ${team}`)

    // TODO: Cache team's logo for a period of time
    return await this.mlbStatic.fetchLogo(teamId)
  }
}
