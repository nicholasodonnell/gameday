import type { AxiosInstance, AxiosResponse } from 'axios'

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosError } from 'axios'

import { Grant } from './types'

import { ApplicationException } from '@/common/errors'

@Injectable()
export class MlbAuthService {
  private readonly CLIENT_ID = '0oa3e1nutA1HLzAKG356'

  private client: AxiosInstance

  constructor(private readonly config: ConfigService) {
    this.client = axios.create({
      baseURL: this.config.getOrThrow<string>('MLB_AUTH_URL'),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:87.0) Gecko/20100101 Firefox/87.0',
      },
    })
  }

  public async fetchGrant(username: string, password: string): Promise<Grant> {
    try {
      const response: AxiosResponse<Grant> = await this.client.post<Grant>(
        '/oauth2/aus1m088yK07noBfh356/v1/token',
        {
          client_id: this.CLIENT_ID,
          grant_type: 'password',
          password,
          scope: 'openid offline_access',
          username,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )

      return response.data
    } catch (cause) {
      throw new ApplicationException(`Failed to fetch grant`, {
        cause,
        status: cause instanceof AxiosError ? cause.response?.status : undefined,
      })
    }
  }
}
