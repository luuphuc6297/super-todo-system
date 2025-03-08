import { CategoryModel } from '@modules/category/models/category.model'
import { PaymentModel } from '@modules/payment/models/payment.model'
import { SubscriptionPlanModel } from '@modules/subscription/models/subscription-plan.model'
import { SubscriptionModel } from '@modules/subscription/models/subscription.model'
import { TagModel } from '@modules/tag/models/tag.model'
import { TaskTagModel } from '@modules/task/models/task-tag.model'
import { TaskModel } from '@modules/task/models/task.model'
import { UserModel } from '@modules/user/models/user.model'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SeedService } from './services/seed.service'

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserModel,
      CategoryModel,
      TaskModel,
      TagModel,
      TaskTagModel,
      SubscriptionModel,
      SubscriptionPlanModel,
      PaymentModel,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
