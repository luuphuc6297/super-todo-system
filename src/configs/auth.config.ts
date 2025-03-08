import { registerAs } from '@nestjs/config'

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    jwt: {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      refreshExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
    },
    password: {
      saltLength: 10,
    },
  })
)
