import { Controller, Get, Header, Render } from '@nestjs/common'

import { GuideService } from './guide.service'
import { GuideTemplate } from './types'

@Controller()
export class GuideController {
  constructor(private readonly guide: GuideService) {}

  @Get('epg.xml')
  @Header('Content-Type', 'application/xml')
  @Render('guide')
  public async root(): Promise<GuideTemplate> {
    return await this.guide.getGuide()
  }
}
