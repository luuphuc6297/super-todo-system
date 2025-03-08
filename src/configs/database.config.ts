import { registerAs } from '@nestjs/config'
import * as Joi from 'joi'

export const databaseConfig = registerAs('database', () => ({
  storage: process.env.DATABASE_HOST || ':memory:',
  dialect: process.env.DATABASE_TYPE || 'sqlite',
  name: process.env.DATABASE_NAME || 'covergo',
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' || true,
  logging: process.env.DATABASE_DEBUG === 'true' || false,
  inMemory: true,
}))

export const databaseValidationSchema = Joi.object({
  DATABASE_HOST: Joi.string().default(':memory:'),
  DATABASE_TYPE: Joi.string().default('sqlite'),
  DATABASE_NAME: Joi.string().default('covergo'),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(true),
  DATABASE_DEBUG: Joi.boolean().default(false),
})
