import { Module } from '@nestjs/common'

import { MlbStaticModule } from '@/clients/mlbstatic'

import { TeamService } from './team.service'

@Module({
  exports: [TeamService],
  imports: [MlbStaticModule],
  providers: [TeamService],
})
export class TeamModule {}
