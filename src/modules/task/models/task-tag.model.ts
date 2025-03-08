import { ModelAbstract } from '@infras/database/abstracts/sqlite/entities/database.base-model.abstract'
import { TagModel } from '@modules/tag/models/tag.model'
import { BelongsTo, Column, ForeignKey, Table } from 'sequelize-typescript'
import { TaskModel } from './task.model'

@Table({ tableName: 'task_tags' })
export class TaskTagModel extends ModelAbstract {
  @ForeignKey(() => TaskModel)
  @Column
  taskId: string

  @BelongsTo(() => TaskModel)
  task: TaskModel

  @ForeignKey(() => TagModel)
  @Column
  tagId: string

  @BelongsTo(() => TagModel)
  tag: TagModel
}
