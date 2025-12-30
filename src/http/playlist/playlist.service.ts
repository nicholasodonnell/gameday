import { Injectable, StreamableFile } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AuthService, Token } from '@/features/auth'
import { Game, GameService } from '@/features/game'
import { Session, SessionService } from '@/features/session'
import { Stream, StreamService } from '@/features/stream'
import { Team, TeamService } from '@/features/team'

import { PlaylistTemplateConfig } from './types'

@Injectable()
export class PlaylistService {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
    private readonly game: GameService,
    private readonly session: SessionService,
    private readonly stream: StreamService,
    private readonly team: TeamService,
  ) {}

  public async getLogoForTeam(team: Team): Promise<StreamableFile> {
    const logoBuffer: Buffer = await this.team.getLogo(team)

    return new StreamableFile(new Uint8Array(logoBuffer))
  }

  public getPlaylistTemplateConfig(): PlaylistTemplateConfig {
    return {
      APP_URL: this.config.getOrThrow<string>('APP_URL'),
    }
  }

  public async getStreamForTeam(team: Team): Promise<string> {
    const game: Game = await this.game.getLiveGame(team)
    const cachedStream: null | Stream = await this.stream.getCachedStream(game)

    if (cachedStream) {
      return cachedStream.url
    }

    const token: Token = (await this.auth.getToken()) ?? (await this.auth.createToken())
    const session: Session = (await this.session.getSession(token)) ?? (await this.session.createSession(token))
    const stream: Stream = await this.stream.createStream(game, session, token)

    return stream.url
  }
}
