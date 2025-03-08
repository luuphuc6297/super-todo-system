import { ModelAbstract } from '@infras/database/abstracts/sqlite/entities/database.base-model.abstract'
import { Column, DataType, Table } from 'sequelize-typescript'

@Table({ tableName: 'subscription_plans' })
export class SubscriptionPlanModel extends ModelAbstract {
  @Column
  name: string

  @Column
  description: string

  @Column(DataType.FLOAT)
  price: number

  @Column(DataType.INTEGER)
  duration: number

  @Column({
    type: DataType.TEXT,
    allowNull: true,  
    get() {
      const rawValue = this.getDataValue('features' as any)
      return  rawValue ? JSON.parse(rawValue) : null
    },
    set(value: any) {
      this.setDataValue('features' as any, value ? JSON.stringify(value) : null)
    },
  })
  features: any
}
