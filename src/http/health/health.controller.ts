import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'

@Controller('health')
class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  public async check() {
    return await this.health.check([])
  }
}

export default HealthController
