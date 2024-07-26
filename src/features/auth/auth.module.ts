import { Module } from '@nestjs/common'

import { AuthService } from './auth.service'

import { MlbAuthModule } from '@/clients/mlbauth'

@Module({
  exports: [AuthService],
  imports: [MlbAuthModule],
  providers: [AuthService],
})
export class AuthModule {}
