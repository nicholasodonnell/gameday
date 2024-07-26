import type { AxiosInstance, AxiosResponse } from 'axios'

import { HttpException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosError } from 'axios'

import { InitPlaybackSessionDto, InitPlaybackSessionResponse, InitSessionResponse, Playback, Session } from './types'

import { ApplicationException } from '@/common/errors'

@Injectable()
export class MediaGatewayService {
  private client: AxiosInstance

  constructor(private readonly config: ConfigService) {
    this.client = axios.create({
      baseURL: this.config.getOrThrow<string>('MEDIA_GATEWAY_URL'),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:87.0) Gecko/20100101 Firefox/87.0',
        'x-client-name': 'WEB',
        'x-client-version': '7.8.1',
      },
    })
  }

  public async initPlaybackSession({
    accessToken,
    deviceId,
    mediaId,
    sessionId,
  }: InitPlaybackSessionDto): Promise<Playback> {
    try {
      const response: AxiosResponse<InitPlaybackSessionResponse> = await this.client.post<InitPlaybackSessionResponse>(
        '/graphql',
        {
          operationName: 'initPlaybackSession',
          query: `mutation initPlaybackSession(
            $adCapabilities: [AdExperienceType]
            $mediaId: String!
            $deviceId: String!
            $sessionId: String!
            $quality: PlaybackQuality
          ) {
            initPlaybackSession(
              adCapabilities: $adCapabilities
              mediaId: $mediaId
              deviceId: $deviceId
              sessionId: $sessionId
              quality: $quality
            ) {
              playbackSessionId
              playback {
                url
                token
                expiration
                cdn
              }
              adScenarios {
                adParamsObj
                adScenarioType
                adExperienceType
              }
              adExperience {
                adExperienceTypes
                adEngineIdentifiers {
                  name
                  value
                }
                adsEnabled
              }
              heartbeatInfo {
                url
                interval
              }
              trackingObj
            }
          }`,
          variables: {
            adCapabilities: ['NONE'],
            deviceId,
            mediaId,
            quality: 'PLACEHOLDER',
            sessionId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      const { data, errors } = response.data

      // GraphQL errors are returned as an array of errors with a 200 status code
      if (errors || !data.initPlaybackSession) {
        throw new ApplicationException(
          errors?.map((error) => error.message)?.join(', ') ?? 'MLB returned no playback',
          { errors },
        )
      }

      return data.initPlaybackSession
    } catch (cause) {
      if (cause instanceof AxiosError) {
        throw new HttpException(`Failed to init playback session`, cause.response?.status ?? 500, { cause })
      }

      if (cause instanceof HttpException) {
        throw cause
      }

      throw new ApplicationException(`Failed to init playback session`, {
        cause,
      })
    }
  }

  public async initSession(accessToken: string): Promise<Session> {
    try {
      const response: AxiosResponse<InitSessionResponse> = await this.client.post<InitSessionResponse>(
        '/graphql',
        {
          operationName: 'initSession',
          query: `mutation initSession($device: InitSessionInput!, $clientType: ClientType!, $experience: ExperienceTypeInput) {
            initSession(device: $device, clientType: $clientType, experience: $experience) {
              deviceId
              sessionId
              entitlements {
                code
              }
              location {
                countryCode
                regionName
                zipCode
                latitude
                longitude
              }
              clientExperience
              features
            }
          }`,
          variables: {
            clientType: 'WEB',
            device: {
              appVersion: '7.8.1',
              deviceFamily: 'desktop',
              knownDeviceId: '',
              languagePreference: 'ENGLISH',
              manufacturer: 'Apple',
              model: 'Macintosh',
              os: 'macos',
              osVersion: '10.15',
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      const { data, errors } = response.data

      // GraphQL errors are returned as an array of errors with a 200 status code
      if (errors || !data.initSession) {
        throw (
          (new ApplicationException(errors?.map((error) => error.message)?.join(', ') ?? 'MLB returned no session'),
          { errors })
        )
      }

      return data.initSession
    } catch (cause) {
      if (cause instanceof AxiosError) {
        throw new HttpException(`Failed to initialize session`, cause.response?.status ?? 500, { cause })
      }

      throw new ApplicationException(`Failed to initialize session`, {
        cause,
      })
    }
  }
}
