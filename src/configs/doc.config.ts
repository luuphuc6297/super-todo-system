import { registerAs } from '@nestjs/config'

export default registerAs(
  'doc',
  (): Record<string, any> => ({
    name: process.env.DOC_NAME || 'Super Todo System API Documentation',
    description: process.env.DOC_DESCRIPTION || 'API Documentation for Super Todo System',
    version: process.env.DOC_VERSION || '1.0',
    prefix: process.env.DOC_PREFIX || 'docs',
  })
)
