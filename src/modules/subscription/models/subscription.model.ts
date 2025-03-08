import { ModelAbstract } from '@infras/database/abstracts/sqlite/entities/database.base-model.abstract'
import { UserModel } from '@modules/user/models/user.model'
import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript'
import { SubscriptionPlanModel } from './subscription-plan.model'

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Table({ tableName: 'subscriptions' })
export class SubscriptionModel extends ModelAbstract {
  @ForeignKey(() => UserModel)
  @Column
  userId: string

  @BelongsTo(() => UserModel)
  user: UserModel

  @ForeignKey(() => SubscriptionPlanModel)
  @Column({
    type: DataType.UUID,
  })
  planId: string

  @BelongsTo(() => SubscriptionPlanModel)
  plan: SubscriptionPlanModel

  @Column(DataType.DATEONLY)
  startDate: Date

  @Column(DataType.DATEONLY)
  endDate: Date

  @Column({
    type: DataType.ENUM(...Object.values(SubscriptionStatus)),
    defaultValue: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus
}
