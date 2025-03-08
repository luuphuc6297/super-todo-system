import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus'

@ApiTags('Health')
@Controller('api')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator
  ) {}

  @Get('health')
  @HealthCheck()
  @ApiOperation({ summary: 'Check application health' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  check() {
    return this.health.check([
      // Check if the application can reach external services
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),

      // Check memory usage
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024), // 200MB

      // Check disk usage
      () => this.disk.checkStorage('disk', { path: '/', thresholdPercent: 0.9 }),
    ])
  }
}
