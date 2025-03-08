import { AppHelloDoc } from '@app/docs/app.doc'
import { AppHelloSerialization } from '@app/serializations/app.hello.serialization'
import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AppService } from '../services/app.service'
import { ConfigService } from '@nestjs/config'

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  @AppHelloDoc()
  @ApiOperation({
    summary: 'Say hello',
    description: 'Return a hello message',
  })
  @ApiResponse({
    status: 200,
    description: 'Hello message',
    type: AppHelloSerialization,
  })
  @Get('hello')
  hello(): AppHelloSerialization {
    return this.appService.hello()
  }

  @ApiOperation({
    summary: 'Health check',
    description: 'Check if the application is running',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy',
  })
  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      name: this.configService.get<string>('app.name'),
      version: process.env.npm_package_version || '0.0.1',
    }
  }
}
