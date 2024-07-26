import { Injectable, Logger, StreamableFile } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { PlaylistTemplateConfig } from './types'

import { AuthService, Token } from '@/features/auth'
import { Game, GameService } from '@/features/game'
import { Session, SessionService } from '@/features/session'
import { Stream, StreamService } from '@/features/stream'
import { Team, TeamService } from '@/features/team'

@Injectable()
export class PlaylistService {
  private readonly logger = new Logger(PlaylistService.name)

  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
    private readonly game: GameService,
    private readonly session: SessionService,
    private readonly stream: StreamService,
    private readonly team: TeamService,
  ) {}

  private async initStream(game: Game): Promise<Stream> {
    const token: Token = (await this.auth.getToken()) ?? (await this.auth.createToken())
    const session: Session = (await this.session.getSession(token)) ?? (await this.session.createSession(token))

    return await this.stream.createStream(game, session, token)
  }

  public getConfig(): PlaylistTemplateConfig {
    return {
      APP_URL: this.config.getOrThrow<string>('APP_URL'),
    }
  }

  public async getLogo(team: Team): Promise<StreamableFile> {
    const buf: Buffer = await this.team.getLogo(team)

    return new StreamableFile(buf)
  }

  public async getTeam(team: Team): Promise<string> {
    this.logger.log(`Attempting to serve stream for ${team}...`)

    const game: Game = await this.game.getLiveGame(team)
    const stream: Stream = (await this.stream.getCachedStream(game)) ?? (await this.initStream(game))

    return stream.url
  }
}
