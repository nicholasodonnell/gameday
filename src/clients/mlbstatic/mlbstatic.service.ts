import type { AxiosInstance, AxiosResponse } from 'axios'

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosError } from 'axios'

import { ApplicationException } from '@/common/errors'
import { TeamId } from '@/features/team/types'

@Injectable()
export class MlbStaticService {
  private client: AxiosInstance

  constructor(private readonly config: ConfigService) {
    this.client = axios.create({
      baseURL: this.config.getOrThrow<string>('MLB_STATIC_URL'),
    })
  }

  public async fetchLogo(teamId: TeamId, size = 250): Promise<Buffer> {
    try {
      const response: AxiosResponse<Buffer> = await this.client.get<Buffer>(`/v1/team/${teamId}/spots/${size}`, {
        responseType: 'arraybuffer',
      })

      return response.data
    } catch (cause) {
      throw new ApplicationException(`Failed to fetch logo`, {
        cause,
        status: cause instanceof AxiosError ? cause.response?.status : undefined,
      })
    }
  }
}
