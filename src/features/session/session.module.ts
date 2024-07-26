import { Module } from '@nestjs/common'

import { SessionService } from './session.service'

import { MediaGatewayModule } from '@/clients/mediagateway'

@Module({
  exports: [SessionService],
  imports: [MediaGatewayModule],
  providers: [SessionService],
})
export class SessionModule {}
