import { ModelAbstract } from '@infras/database/abstracts/sqlite/entities/database.base-model.abstract'
import { Column, DataType, Table } from 'sequelize-typescript'

@Table({ tableName: 'categories' })
export class CategoryModel extends ModelAbstract {
  @Column
  name: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string
}
