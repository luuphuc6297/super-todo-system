import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as winston from 'winston'
import { createLogger, format, transports } from 'winston'

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger
  private context: string

  constructor(private readonly configService: ConfigService) {
    const logLevel = this.configService.get<string>('app.log.level') || 'info'
    const isProduction = this.configService.get<string>('app.env') === 'production'

    this.logger = createLogger({
      level: logLevel,
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      defaultMeta: { service: 'api' },
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ timestamp, level, message, context, ...meta }) => {
              return `${timestamp} [${level}] [${context || this.context || 'Application'}]: ${message} ${
                Object.keys(meta).length ? JSON.stringify(meta) : ''
              }`
            })
          ),
        }),
        ...(isProduction
          ? [
              new transports.File({
                filename: 'logs/error.log',
                level: 'error',
              }),
              new transports.File({ filename: 'logs/combined.log' }),
            ]
          : []),
      ],
    })
  }

  setContext(context: string): void {
    this.context = context
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context: context || this.context })
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { trace, context: context || this.context })
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context: context || this.context })
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context: context || this.context })
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context: context || this.context })
  }
}
