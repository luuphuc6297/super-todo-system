import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DebuggerService } from './services/debugger.service'
import { LoggerService } from './services/logger.service'

@Module({
  imports: [ConfigModule],
  providers: [LoggerService, DebuggerService],
  exports: [LoggerService, DebuggerService],
})
export class LoggingModule {}
