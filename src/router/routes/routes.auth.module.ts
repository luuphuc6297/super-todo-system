import { AuthenticationModule } from '@infras/authentication/authentication.module'
import { AuthController } from '@infras/authentication/controllers/auth.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [AuthenticationModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class RoutesAuthModule {}
