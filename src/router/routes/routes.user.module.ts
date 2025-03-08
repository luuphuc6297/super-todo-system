import { UserModule } from '@modules/user/user.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class RoutesUserModule {}
