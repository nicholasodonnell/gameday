import { Injectable, Logger } from '@nestjs/common'

import { Session, SessionEntity, SessionException } from './types'

import { Session as MLBSession, MediaGatewayService } from '@/clients/mediagateway'
import { Token } from '@/features/auth'
import { InjectKnex, Knex } from '@/providers/knex'

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name)

  constructor(
    @InjectKnex() private readonly knex: Knex,
    private readonly mediaGateway: MediaGatewayService,
  ) {}

  private async insertSession(data: Omit<SessionEntity, 'created_at'>): Promise<SessionEntity> {
    try {
      const [entity] = await this.knex<SessionEntity>('session')
        .insert({
          ...data,
          created_at: new Date(),
        })
        .returning('*')

      return entity
    } catch (cause) {
      throw new SessionException('Failed to insert session', { cause, ...data })
    }
  }

  private async selectSessionByTokenId(tokenId: string): Promise<SessionEntity | undefined> {
    try {
      return await this.knex<SessionEntity>('session').select('*').where('token_id', tokenId).first()
    } catch (cause) {
      throw new SessionException('Failed to select session by token ID', { cause, tokenId })
    }
  }

  public async createSession(token: Token): Promise<Session> {
    try {
      const mlbSession: MLBSession = await this.mediaGateway.initSession(token.id)
      const session: SessionEntity = await this.insertSession({
        device_id: mlbSession.deviceId,
        id: mlbSession.sessionId,
        token_id: token.id,
      })

      this.logger.debug({ session }, `Created new session`)

      return {
        deviceId: session.device_id,
        id: session.id,
      }
    } catch (cause) {
      throw new SessionException('Failed to initialize MLB session', { cause })
    }
  }

  public async getSession(token: Token): Promise<Session | null> {
    try {
      const session: SessionEntity | undefined = await this.selectSessionByTokenId(token.id)

      if (!session) {
        this.logger.debug(`No valid session found`)

        return null
      }

      this.logger.debug({ session }, `Using existing session`)

      return {
        deviceId: session.device_id,
        id: session.id,
      }
    } catch (cause) {
      throw new SessionException('Failed to get session', { cause, token })
    }
  }
}
