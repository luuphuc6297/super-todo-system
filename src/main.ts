import { AppModule } from '@app/app.module'
import { Logger, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestApplication, NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'
import * as compression from 'compression'
import helmet from 'helmet'
import { UserRoleFilterInterceptor } from './infrastructures/authentication/interceptors/user-role-filter.interceptor'
import { ResponseInterceptor } from './infrastructures/http/interceptors/response.interceptor'
import { ResponseService } from './infrastructures/http/services/response.service'
import { SeedService } from './infrastructures/seed/services/seed.service'
import swaggerInit from './swagger'

async function bootstrap() {
  try {
    const app: NestApplication = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService)

    const env = configService.get<string>('app.env')
    const httpHost = configService.get<string>('app.http.host')
    const port = configService.get<number>('app.http.port')
    const globalPrefix = configService.get<string>('app.globalPrefix')
    const versioningPrefix = configService.get<string>('app.versioning.prefix')
    const version = configService.get<string>('app.versioning.version')

    // Enable flags
    const httpEnable = configService.get<boolean>('app.http.enable')
    const versionEnable = configService.get<string>('app.versioning.enable')

    const logger = new Logger()

    // Set NODE_ENV from app.env for consistency
    process.env.NODE_ENV = env

    // Log environment variables for debugging
    logger.log(`NODE_ENV: ${process.env.NODE_ENV}`, 'Environment')
    logger.log(`APP_ENV: ${process.env.APP_ENV}`, 'Environment')
    logger.log(`Configured env: ${env}`, 'Environment')

    // Middleware
    app.use(helmet())
    app.use(compression())
    app.enableCors()

    // Global prefix
    app.setGlobalPrefix(globalPrefix)
    useContainer(app.select(AppModule), { fallbackOnErrors: true })

    // Global interceptors
    const responseService = app.get(ResponseService)
    app.useGlobalInterceptors(
      new UserRoleFilterInterceptor(),
      new ResponseInterceptor(responseService)
    )

    // Versioning
    if (versionEnable) {
      app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: version,
        prefix: versioningPrefix,
      })
    }

    // Swagger
    await swaggerInit(app)

    // Seed database in all environments when using in-memory database
    try {
      const seedService = app.get(SeedService)
      await seedService.seed()
      logger.log('Database seeded successfully', 'SeedService')
    } catch (error) {
      logger.error(`Failed to seed database: ${error.message}`, error.stack, 'SeedService')
    }

    const isDevelopmentOrTest = env === 'development' || env === 'testing'
    const host = isDevelopmentOrTest ? httpHost || 'localhost' : '0.0.0.0'

    // Prioritize Railway's PORT environment variable
    const serverPort = process.env.PORT || port || 8080

    // Listen
    await app.listen(serverPort, host)

    logger.log(`==========================================================`)
    logger.log(`Environment: ${env || 'production'}`, 'NestApplication')
    logger.log(`HTTP is ${httpEnable ? 'enabled' : 'disabled'}`, 'NestApplication')
    logger.log(`HTTP versioning is ${versionEnable ? 'enabled' : 'disabled'}`, 'NestApplication')
    logger.log(`Server running on http://${host}:${serverPort}`, 'NestApplication')
    logger.log(`Listening on host: ${host}, port: ${serverPort}`, 'NestApplication')
    logger.log(`==========================================================`)

    // Handle shutdown gracefully
    const signals = ['SIGTERM', 'SIGINT']

    for (const signal of signals) {
      process.on(signal, async () => {
        logger.log(`Received ${signal}, gracefully shutting down...`, 'NestApplication')
        await app.close()
        logger.log('Application shut down successfully', 'NestApplication')
        process.exit(0)
      })
    }
  } catch (error) {
    console.error('Failed to start application:', error)
    process.exit(1)
  }
}

bootstrap()
