import { InfrasModule } from '@infras/infras.module'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SubscriptionPlanModel } from './models/subscription-plan.model'
import { SubscriptionModel } from './models/subscription.model'

@Module({
  imports: [SequelizeModule.forFeature([SubscriptionModel, SubscriptionPlanModel]), InfrasModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class SubscriptionModule {}
