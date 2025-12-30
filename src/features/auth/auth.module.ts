import { Module } from '@nestjs/common'

import { MlbAuthModule } from '@/clients/mlbauth'

import { AuthService } from './auth.service'

@Module({
  exports: [AuthService],
  imports: [MlbAuthModule],
  providers: [AuthService],
})
export class AuthModule {}
