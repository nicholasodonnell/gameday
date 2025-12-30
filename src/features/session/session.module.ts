import { Module } from '@nestjs/common'

import { MediaGatewayModule } from '@/clients/mediagateway'

import { SessionService } from './session.service'

@Module({
  exports: [SessionService],
  imports: [MediaGatewayModule],
  providers: [SessionService],
})
export class SessionModule {}
