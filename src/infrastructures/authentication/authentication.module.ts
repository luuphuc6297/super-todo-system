import { UserModule } from '@modules/user/user.module'
import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtAuthGuard } from './guards/jwt.guard'
import { RoleGuard } from './guards/role.guard'
import { ApiKeyService } from './services/api-key.service'
import { AuthService } from './services/auth.service'
import { RoleService } from './services/role.service'

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UserModule),
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
    PassportModule,
  ],
  controllers: [],
  providers: [AuthService, ApiKeyService, RoleService, JwtAuthGuard, RoleGuard],
  exports: [AuthService, ApiKeyService, RoleService, JwtAuthGuard, RoleGuard],
})
export class AuthenticationModule {}
