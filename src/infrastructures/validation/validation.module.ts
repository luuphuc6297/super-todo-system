import { UserModule } from '@modules/user/user.module'
import { forwardRef, Module } from '@nestjs/common'
import { IsEmailUniqueConstraint } from './decorators/is-email-unique.decorator'

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [IsEmailUniqueConstraint],
  exports: [IsEmailUniqueConstraint],
})
export class ValidationModule {}
