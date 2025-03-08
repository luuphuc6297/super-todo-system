import { ModelAbstract } from '@infras/database/abstracts/sqlite/entities/database.base-model.abstract'
import { UserModel } from '@modules/user/models/user.model'
import { CategoryModel } from '@modules/category/models/category.model'
import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript'

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Table({ tableName: 'tasks' })
export class TaskModel extends ModelAbstract {
  @Column
  title: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string

  @ForeignKey(() => UserModel)
  @Column
  creatorId: string

  @BelongsTo(() => UserModel, 'creatorId')
  creator: UserModel

  @ForeignKey(() => UserModel)
  @Column({
    allowNull: true,
  })
  assigneeId: string

  @BelongsTo(() => UserModel, 'assigneeId')
  assignee: UserModel

  @ForeignKey(() => CategoryModel)
  @Column({
    allowNull: true,
  })
  categoryId: string

  @BelongsTo(() => CategoryModel)
  category: CategoryModel

  @Column({
    type: DataType.ENUM(...Object.values(TaskPriority)),
    defaultValue: TaskPriority.MEDIUM,
  })
  priority: TaskPriority

  @Column(DataType.INTEGER)
  estimateTime: number // in minutes

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    defaultValue: TaskStatus.TODO,
  })
  status: TaskStatus

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string // Only for paid users

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  dueDate: Date
} 