import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { InfrasModule } from '@infras/infras.module'
import { RouterModule } from '@router/router.module'
import { AppController } from './controllers/app.controller'
import { AppService } from './services/app.service'
import { HealthModule } from '../infrastructures/health/health.module'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InfrasModule,
    RouterModule.forRoot(),
    HealthModule,
  ],
})
export class AppModule {}
