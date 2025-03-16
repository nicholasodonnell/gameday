import { Controller, Get, Header, HttpException, NotFoundException, Param, Res, StreamableFile } from '@nestjs/common'
import { Response } from 'express'

import { PlaylistService } from './playlist.service'
import { PlaylistTemplateConfig } from './types'

import { NoLiveGameException } from '@/features/game'
import { BlackedOutException } from '@/features/stream'
import { Team, TeamNotFoundException } from '@/features/team/types'

@Controller()
export class PlaylistController {
  constructor(private readonly playlist: PlaylistService) {}

  @Get('playlist.m3u')
  public async getPlaylist(@Res() res: Response): Promise<void> {
    const config: PlaylistTemplateConfig = await this.playlist.getPlaylistTemplateConfig()

    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Content-Type', 'application/x-mpegURL')
    res.render('playlist', config)

    return
  }

  @Get('playlist/logo/:team.png')
  @Header('Content-Type', 'image/png')
  public async getTeamLogo(@Param('team') team: Team): Promise<StreamableFile> {
    try {
      return await this.playlist.getLogoForTeam(team)
    } catch (cause) {
      if (cause instanceof TeamNotFoundException) {
        throw new NotFoundException(`Team not found`)
      }

      throw new HttpException(`Failed to get ${team.toString()} logo`, 500, { cause })
    }
  }

  @Get('playlist/:team.m3u8')
  public async getTeamPlaylist(@Param('team') team: Team, @Res() res: Response): Promise<void> {
    try {
      const stream = await this.playlist.getStreamForTeam(team)

      res.setHeader('Content-Type', 'application/x-mpegURL')
      res.setHeader('Cache-Control', 'no-cache')
      res.render('stream', { stream })

      return
    } catch (cause) {
      if (cause instanceof NoLiveGameException) {
        res.setHeader('Content-Type', 'application/x-mpegURL')
        res.setHeader('Cache-Control', 'no-cache')
        res.render('offair')

        return
      }

      if (cause instanceof BlackedOutException) {
        res.setHeader('Content-Type', 'application/x-mpegURL')
        res.setHeader('Cache-Control', 'no-cache')
        res.render('blackout')

        return
      }

      if (cause instanceof TeamNotFoundException) {
        throw new NotFoundException(`Team not found`)
      }

      throw new HttpException(`Failed to get ${team.toString()} playlist`, 500, { cause })
    }
  }
}
