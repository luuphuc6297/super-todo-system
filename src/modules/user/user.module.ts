import { InfrasModule } from '@infras/infras.module'
import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserController } from './controllers/user.controller'
import { UserModel } from './models/user.model'
import { UserRepository } from './repositories/user.repository'
import { UserService } from './services/user.service'

@Module({
  imports: [SequelizeModule.forFeature([UserModel]), forwardRef(() => InfrasModule)],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
