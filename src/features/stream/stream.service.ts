import type { AxiosResponse } from 'axios'

import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

import { Bitrate, BlackedOutException, Stream, StreamEntity, StreamException } from './types'

import { MediaGatewayService, Playback } from '@/clients/mediagateway'
import { ApplicationException } from '@/common/errors'
import { Token } from '@/features/auth'
import { Game } from '@/features/game'
import { Session } from '@/features/session'
import { InjectKnex, Knex } from '@/providers/knex'

@Injectable()
export class StreamService {
  private readonly logger = new Logger(StreamService.name)

  constructor(
    private readonly config: ConfigService,
    @InjectKnex() private readonly knex: Knex,
    private readonly mediaGateway: MediaGatewayService,
  ) {}

  private async fetchBitrateFromPlaylist(playlistUrl: string, bitrate: Bitrate): Promise<string | undefined> {
    try {
      const response: AxiosResponse<string> = await axios.get<string>(playlistUrl)
      const data: string = response.data

      // MLB's m3u8 file contains relative links
      // because we don't want to proxy all these segments
      // prepend the links with the stream URL
      const baseUrl: string = playlistUrl.replace(/\/[^\\/]+\.m3u8$/, '')
      const playlistData: string = data.replace(/(\b[\w-]+\.m3u8\b)/g, `${baseUrl}/$1`)

      // Extract the desired bitrate from the playlist
      const match: RegExpMatchArray | null = playlistData.match(new RegExp(`https://.*${bitrate}K.m3u8`))

      return match?.[0]
    } catch (cause) {
      throw new StreamException('Failed to fetch bitrate from playlist', { cause, playlistUrl })
    }
  }

  private async insertStream(data: Omit<StreamEntity, 'created_at' | 'id'>): Promise<StreamEntity> {
    try {
      const [entity] = await this.knex<StreamEntity>('stream')
        .insert({
          ...data,
          created_at: new Date(),
        })
        .returning('*')

      return entity
    } catch (cause) {
      throw new StreamException('Failed to insert stream', { cause, ...data })
    }
  }

  private async selectStreamByMediaId(mediaId: string): Promise<StreamEntity | undefined> {
    try {
      return await this.knex<StreamEntity>('stream')
        .select('*')
        .where('media_id', mediaId)
        .where('expires_at', '>', new Date().valueOf())
        .first()
    } catch (cause) {
      throw new StreamException('Failed to select stream by media ID', { cause, mediaId })
    }
  }

  public async createStream(game: Game, session: Session, token: Token): Promise<Stream> {
    this.logger.log(`Generating stream...`)

    try {
      const bitrate: Bitrate = this.config.getOrThrow<Bitrate>('BITRATE')
      const playback: Playback = await this.mediaGateway.initPlaybackSession({
        accessToken: token.id,
        deviceId: session.deviceId,
        mediaId: game.mediaId,
        sessionId: session.id,
      })

      this.logger.debug({ ...playback.playback }, `Initalized MLB playback session`)
      const url: string | undefined = await this.fetchBitrateFromPlaylist(playback.playback.url, bitrate)

      if (!url) {
        throw new StreamException('Failed to find desired bitrate in playlist', { bitrate })
      }

      this.logger.debug({ bitrate, url }, `Found desired bitrate in playlist`)

      const stream: StreamEntity = await this.insertStream({
        bitrate,
        expires_at: new Date(playback.playback.expiration),
        media_id: game.mediaId,
        title: game.title,
        url,
      })

      this.logger.debug({ ...stream }, `Cached stream`)

      return {
        bitrate: stream.bitrate,
        expiresAt: stream.expires_at,
        id: stream.id,
        mediaId: stream.media_id,
        title: stream.title,
        url: stream.url,
      }
    } catch (cause) {
      if (cause instanceof ApplicationException && cause.getFullMessage().includes('blacked out')) {
        this.logger.warn({ ...game }, 'Game is blacked out')
        throw new BlackedOutException('Game is blacked out', { ...game })
      }

      throw new StreamException('Failed to generate stream', { cause })
    }
  }

  public async deleteExpiredStreams(): Promise<number> {
    try {
      return await this.knex<StreamEntity>('stream').where('expires_at', '<', new Date().valueOf()).del()
    } catch (cause) {
      throw new StreamException('Failed to delete expired streams', { cause })
    }
  }

  public async getCachedStream(game: Game): Promise<Stream | null> {
    try {
      const stream: StreamEntity | undefined = await this.selectStreamByMediaId(game.mediaId)

      if (!stream) {
        this.logger.debug({ game }, 'Cached stream not found')

        return null
      }

      this.logger.debug({ ...stream, game }, `Found cached stream`)

      return {
        bitrate: stream.bitrate,
        expiresAt: stream.expires_at,
        id: stream.id,
        mediaId: stream.media_id,
        title: stream.title,
        url: stream.url,
      }
    } catch (cause) {
      throw new StreamException('Failed to get cached stream', { cause })
    }
  }
}
