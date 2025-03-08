import { registerAs } from '@nestjs/config'

export default registerAs(
  'helper',
  (): Record<string, any> => ({
    hash: {
      saltLength: 8,
    },
    encryption: {
      key: process.env.ENCRYPTION_KEY || 'secretKey',
      algorithm: 'aes-256-cbc',
    },
  })
)
