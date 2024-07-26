import { HttpException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AuthException, Token, TokenEntity } from './types'

import { Grant, MlbAuthService } from '@/clients/mlbauth'
import { InjectKnex, Knex } from '@/providers/knex'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly config: ConfigService,
    @InjectKnex() private readonly knex: Knex,
    private readonly mlbAuth: MlbAuthService,
  ) {}

  private async insertToken(data: Omit<TokenEntity, 'created_at'>): Promise<TokenEntity> {
    const [entity] = await this.knex<TokenEntity>('token')
      .insert({
        ...data,
        created_at: new Date(),
      })
      .returning('*')

    return entity
  }

  private async selectActiveToken(): Promise<TokenEntity | undefined> {
    return await this.knex<TokenEntity>('token').select('*').where('expires_at', '>', new Date().valueOf()).first()
  }

  public async createToken(): Promise<Token> {
    this.logger.log(`Generating new MLB auth token...`)

    try {
      const username = this.config.getOrThrow<string>('MLB_USERNAME')
      const password = this.config.getOrThrow<string>('MLB_PASSWORD')
      const grant: Grant = await this.mlbAuth.fetchGrant(username, password)
      const { access_token, expires_in } = grant

      this.logger.debug({ access_token, expires_in }, `Received auth grant from MLB`)

      const token: TokenEntity = await this.insertToken({
        expires_at: new Date(Date.now() + expires_in * 1000),
        id: access_token,
      })

      this.logger.debug({ ...token }, `Created new auth token`)

      return {
        expires: token.expires_at,
        id: token.id,
      }
    } catch (cause) {
      const status: number | undefined = cause instanceof HttpException ? cause.getStatus() : undefined

      if (status && status === 401) {
        throw new AuthException('Invalid username and password', { cause })
      }

      throw new AuthException('Failed to authenticate with MLB', { cause })
    }
  }

  public async deleteExpiredTokens(): Promise<number> {
    try {
      // will cascade delete all associated sessions
      return await this.knex<TokenEntity>('token').where('expires_at', '<', new Date().valueOf()).del()
    } catch (cause) {
      throw new AuthException('Failed to delete inactive tokens', { cause })
    }
  }

  public async getToken(): Promise<Token | null> {
    try {
      const token: TokenEntity | undefined = await this.selectActiveToken()

      if (!token) {
        this.logger.debug(`No valid auth token found`)

        return null
      }

      this.logger.debug({ ...token }, `Using existing auth token`)

      return {
        expires: token.expires_at,
        id: token.id,
      }
    } catch (cause) {
      throw new AuthException('Failed to get auth token', { cause })
    }
  }
}
