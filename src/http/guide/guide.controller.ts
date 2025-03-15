import { Controller, Get, HttpException, Res } from '@nestjs/common'
import { Response } from 'express'

import { GuideService } from './guide.service'
import { GuideTemplate } from './types'

@Controller()
export class GuideController {
  constructor(private readonly guide: GuideService) {}

  @Get('epg.xml')
  public async getGuide(@Res() res: Response): Promise<void> {
    try {
      const guide: GuideTemplate = await this.guide.getGuideTemplate()

      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Content-Type', 'application/xml')
      res.render('guide', guide)

      return
    } catch (cause) {
      throw new HttpException(`Failed to get guide`, 500, { cause })
    }
  }
}
