import configs from '@configs/index'
import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthenticationModule } from './authentication/authentication.module'
import { DatabaseModule } from './database/database.module'
import { ErrorModule } from './error/error.module'
import { HelperModule } from './helper/helper.module'
import { HttpModule } from './http/http.module'
import { LoggingModule } from './logging/logging.module'
import { ValidationModule } from './validation/validation.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule,
    DatabaseModule,
    AuthenticationModule,
    HttpModule,
    HelperModule,
    ErrorModule,
    LoggingModule,
    forwardRef(() => ValidationModule),
  ],
  exports: [
    ConfigModule,
    TypeOrmModule,
    DatabaseModule,
    AuthenticationModule,
    HttpModule,
    HelperModule,
    ErrorModule,
    LoggingModule,
    ValidationModule,
  ],
})
export class InfrasModule {}
