import { ModelAbstract } from '@infras/database/abstracts/sqlite/entities/database.base-model.abstract'
import { UserModel } from '@modules/user/models/user.model'
import { SubscriptionModel } from '@modules/subscription/models/subscription.model'
import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript'

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Table({ tableName: 'payments' })
export class PaymentModel extends ModelAbstract {
  @ForeignKey(() => UserModel)
  @Column
  userId: string

  @BelongsTo(() => UserModel)
  user: UserModel

  @ForeignKey(() => SubscriptionModel)
  @Column
  subscriptionId: string

  @BelongsTo(() => SubscriptionModel)
  subscription: SubscriptionModel

  @Column(DataType.FLOAT)
  amount: number

  @Column(DataType.DATE)
  paymentDate: Date

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
  })
  paymentMethod: PaymentMethod

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    defaultValue: PaymentStatus.PENDING,
  })
  status: PaymentStatus

  @Column
  transactionId: string
} 