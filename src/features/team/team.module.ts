import { Module } from '@nestjs/common'

import { TeamService } from './team.service'

import { MlbStaticModule } from '@/clients/mlbstatic'

@Module({
  exports: [TeamService],
  imports: [MlbStaticModule],
  providers: [TeamService],
})
export class TeamModule {}
