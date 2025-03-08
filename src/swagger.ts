import { ENUM_APP_ENVIRONMENT } from '@app/constants/app.enum.constant'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestApplication } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export default async function (app: NestApplication) {
  const configService = app.get(ConfigService)
  const env = configService.get<string>('app.env')
  const logger = new Logger()

  const docName = configService.get<string>('doc.name')
  const docDesc = configService.get<string>('doc.description')
  const docVersion = configService.get<string>('doc.version')
  const docPrefix = configService.get<string>('doc.prefix')

  if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
    const documentBuild = new DocumentBuilder()
      .setTitle(docName)
      .setDescription(docDesc)
      .setVersion(docVersion)
      .addTag("API's")
      .addServer(`/`)
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refreshToken')
      .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'apiKey')
      .build()

    const document = SwaggerModule.createDocument(app, documentBuild, {
      deepScanRoutes: true,
    })

    SwaggerModule.setup(docPrefix, app, document, {
      explorer: true,
      customSiteTitle: docName,
    })

    logger.log(`==========================================================`)
    logger.log(`Docs will serve on ${docPrefix}`, 'NestApplication')
    logger.log(`==========================================================`)
  }
}
