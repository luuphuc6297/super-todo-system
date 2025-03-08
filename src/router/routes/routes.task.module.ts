import { AuthenticationModule } from '@infras/authentication/authentication.module'
import { UserRoleFilterInterceptor } from '@infras/authentication/interceptors/user-role-filter.interceptor'
import { UserRoleMiddleware } from '@infras/authentication/middlewares/user-role.middleware'
import { TaskController } from '@modules/task/controllers/task.controller'
import { TaskModule } from '@modules/task/task.module'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

@Module({
  imports: [TaskModule, AuthenticationModule],
  controllers: [TaskController],
  providers: [UserRoleFilterInterceptor, UserRoleMiddleware],
  exports: [UserRoleFilterInterceptor],
})
export class RoutesTaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserRoleMiddleware).forRoutes(TaskController)
  }
}
