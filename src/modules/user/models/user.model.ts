import { ModelAbstract } from '@infras/database/abstracts/sqlite/entities/database.base-model.abstract'
import { Column, DataType, Table } from 'sequelize-typescript'

export enum UserRole {
  FREE = 'free',
  PAID = 'paid',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

@Table({ tableName: 'users' })
export class UserModel extends ModelAbstract {
  @Column({
    unique: true,
  })
  username: string

  @Column({
    unique: true,
  })
  email: string

  @Column
  password: string

  @Column({
    allowNull: true,
  })
  fullName: string

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.FREE,
  })
  role: UserRole

  @Column({
    type: DataType.ENUM(...Object.values(UserStatus)),
    defaultValue: UserStatus.ACTIVE,
  })
  status: UserStatus

  @Column({
    allowNull: true,
  })
  lastLoginAt: Date

  @Column({
    defaultValue: false,
  })
  isEmailVerified: boolean
}
