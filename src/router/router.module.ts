import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common'
import { RouterModule as NestJsRouterModule } from '@nestjs/core'
import { RoutesAdminModule } from './routes/routes.admin.module'
import { RoutesAuthModule } from './routes/routes.auth.module'
import { RoutesCategoryModule } from './routes/routes.category.module'
import { RoutesPublicModule } from './routes/routes.public.module'
import { RoutesTagModule } from './routes/routes.tag.module'
import { RoutesTaskModule } from './routes/routes.task.module'
import { RoutesUserModule } from './routes/routes.user.module'

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] =
      []

    imports.push(
      RoutesPublicModule,
      RoutesUserModule,
      RoutesAdminModule,
      RoutesAuthModule,
      RoutesTaskModule,
      RoutesCategoryModule,
      RoutesTagModule,
      NestJsRouterModule.register([
        {
          path: '/public',
          module: RoutesPublicModule,
        },
        {
          path: '/admin',
          module: RoutesAdminModule,
        },
        {
          path: '/users',
          module: RoutesUserModule,
        },
        {
          path: '/auth',
          module: RoutesAuthModule,
        },
        {
          path: '/tasks',
          module: RoutesTaskModule,
        },
        {
          path: '/categories',
          module: RoutesCategoryModule,
        },
        {
          path: '/tags',
          module: RoutesTagModule,
        },
      ])
    )

    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    }
  }
}
