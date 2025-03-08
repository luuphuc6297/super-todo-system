import { ModelAbstract } from '@infras/database/abstracts/sqlite/entities/database.base-model.abstract'
import { Column, Table } from 'sequelize-typescript'

@Table({ tableName: 'tags' })
export class TagModel extends ModelAbstract {
  @Column({
    unique: true,
  })
  name: string

  @Column({
    allowNull: true
  })
  color: string
} 