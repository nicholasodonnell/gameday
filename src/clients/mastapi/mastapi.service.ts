import type { AxiosInstance, AxiosResponse } from 'axios'

import { HttpException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosError } from 'axios'
import { format } from 'date-fns'

import { Epg, SearchEpgResponse } from './types'

import { ApplicationException } from '@/common/errors'
import { TeamId } from '@/features/team/types'

@Injectable()
export class MastApiService {
  private client: AxiosInstance

  constructor(private readonly config: ConfigService) {
    this.client = axios.create({
      baseURL: `${this.config.getOrThrow<string>('MLB_MASTAPI_URL')}/api`,
    })
  }

  public async searchEpg(teamId: TeamId, startDate = new Date(), endDate = new Date()): Promise<Epg[]> {
    try {
      const response: AxiosResponse<SearchEpgResponse> = await this.client.get<SearchEpgResponse>('/epg/v3/search', {
        params: {
          endDate: format(endDate, 'yyyy-MM-dd'),
          exp: 'MLB',
          startDate: format(startDate, 'yyyy-MM-dd'),
          teamId,
        },
      })

      return response.data.results
    } catch (cause) {
      if (cause instanceof AxiosError) {
        throw new HttpException(`Failed to fetch epg`, cause.response?.status ?? 500, { cause })
      }

      throw new ApplicationException(`Failed to fetch epg`, {
        cause,
      })
    }
  }
}
