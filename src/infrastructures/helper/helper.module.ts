import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { HelperDateService } from './services/helper.date.service'
import { HelperHashService } from './services/helper.hash.service'
import { HelperStringService } from './services/helper.string.service'

@Global()
@Module({
  imports: [
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
  ],
  providers: [HelperDateService, HelperHashService, HelperStringService],
  exports: [HelperDateService, HelperHashService, HelperStringService, JwtModule],
})
export class HelperModule {}
