import { InfrasModule } from '@infras/infras.module'
import { Module } from '@nestjs/common'
import { RouterModule } from '@router/router.module'
import { AppController } from './controllers/app.controller'
import { AppService } from './services/app.service'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [InfrasModule, RouterModule.forRoot()],
})
export class AppModule {}
