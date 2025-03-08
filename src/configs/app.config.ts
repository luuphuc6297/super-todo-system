import { registerAs } from '@nestjs/config'

export default registerAs(
  'app',
  (): Record<string, any> => ({
    env: process.env.APP_ENV || 'development',
    name: process.env.APP_NAME || 'CoverGo Coding Challenge',

    http: {
      enable: process.env.APP_HTTP_ENABLE === 'true',
      host: process.env.APP_HTTP_HOST || 'localhost',
      port: Number(process.env.APP_HTTP_PORT) || 3000,
    },

    globalPrefix: process.env.APP_GLOBAL_PREFIX || 'api',

    versioning: {
      enable: process.env.APP_VERSIONING_ENABLE === 'true',
      prefix: process.env.APP_VERSIONING_PREFIX || 'v',
      version: process.env.APP_VERSIONING_VERSION || '1',
    },
  })
)
