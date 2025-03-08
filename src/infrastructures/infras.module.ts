import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthenticationModule } from './authentication/authentication.module'
import { DatabaseModule } from './database/database.module'
import { ErrorModule } from './error/error.module'
import { HelperModule } from './helper/helper.module'
import { HttpModule } from './http/http.module'
import { LoggingModule } from './logging/logging.module'
import { ValidationModule } from './validation/validation.module'
import configs from '@configs/index'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('auth.jwt.expiresIn'),
        },
      }),
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
    JwtModule,
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
