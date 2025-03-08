import { AppModule } from '@app/app.module'
import { Logger, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestApplication, NestFactory } from '@nestjs/core'
import { useContainer } from 'class-validator'
import * as compression from 'compression'
import helmet from 'helmet'
import { SeedService } from './infrastructures/seed/services/seed.service'
import swaggerInit from './swagger'
import { UserRoleFilterInterceptor } from './infrastructures/authentication/interceptors/user-role-filter.interceptor'
import { ResponseInterceptor } from './infrastructures/http/interceptors/response.interceptor'
import { ResponseService } from './infrastructures/http/services/response.service'

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  const env = configService.get<string>('app.env')
  const host = configService.get<string>('app.http.host')
  const port = configService.get<number>('app.http.port')
  const globalPrefix = configService.get<string>('app.globalPrefix')
  const versioningPrefix = configService.get<string>('app.versioning.prefix')
  const version = configService.get<string>('app.versioning.version')

  // Enable flags
  const httpEnable = configService.get<boolean>('app.http.enable')
  const versionEnable = configService.get<string>('app.versioning.enable')

  const logger = new Logger()
  process.env.NODE_ENV = env

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

  // Seed database
  if (env === 'development') {
    try {
      const seedService = app.get(SeedService)
      await seedService.seed()
      logger.log('Database seeded successfully', 'SeedService')
    } catch (error) {
      logger.error(`Failed to seed database: ${error.message}`, error.stack, 'SeedService')
    }
  }

  // Listen
  await app.listen(port, host)

  logger.log(`==========================================================`)
  logger.log(`Environment: ${env}`, 'NestApplication')
  logger.log(`HTTP is ${httpEnable ? 'enabled' : 'disabled'}`, 'NestApplication')
  logger.log(`HTTP versioning is ${versionEnable ? 'enabled' : 'disabled'}`, 'NestApplication')
  logger.log(`Server running on ${await app.getUrl()}`, 'NestApplication')
  logger.log(`==========================================================`)
}

bootstrap()
