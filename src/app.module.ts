import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { GuideModule } from '@/http/guide'
import { HealthModule } from '@/http/health'
import { PlaylistModule } from '@/http/playlist'
import { ConfigModule } from '@/providers/config'
import { KnexModule } from '@/providers/knex'
import { LoggerModule } from '@/providers/logger'
import { CleanupModule } from '@/tasks/cleanup'

@Module({
  imports: [
    // providers
    ConfigModule,
    KnexModule.forRoot(),
    LoggerModule,
    ScheduleModule.forRoot(),

    // http
    GuideModule,
    HealthModule,
    PlaylistModule,

    // tasks
    CleanupModule,
  ],
})
export class AppModule {}
