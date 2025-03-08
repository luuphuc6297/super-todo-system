import {
  DATABASE_CREATED_AT_FIELD_NAME,
  DATABASE_DELETED_AT_FIELD_NAME,
  DATABASE_UPDATED_AT_FIELD_NAME,
} from '@infras/database/constants/database.constant'
import {
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Model,
  PrimaryKey,
  UpdatedAt,
} from 'sequelize-typescript'

export abstract class ModelAbstract extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string

  @CreatedAt
  @Column({
    field: DATABASE_CREATED_AT_FIELD_NAME,
    type: DataType.DATE,
  })
  createdAt: Date

  @UpdatedAt
  @Column({
    field: DATABASE_UPDATED_AT_FIELD_NAME,
    type: DataType.DATE,
  })
  updatedAt: Date

  @DeletedAt
  @Column({
    field: DATABASE_DELETED_AT_FIELD_NAME,
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt?: Date
}
