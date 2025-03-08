import { IDatabaseFindAllOptions } from '@infras/database/interfaces/database.interface'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FindOptions } from 'sequelize'
import { TaskModel, TaskStatus } from '../models/task.model'
import { DatabaseSequelizeRepositoryAbstract } from '@infras/database/abstracts/sqlite/repositories/database.sequelize.repository.abstract'
import { TaskTagModel } from '../models/task-tag.model'

@Injectable()
export class TaskRepository extends DatabaseSequelizeRepositoryAbstract<TaskModel> {
  constructor(
    @InjectModel(TaskModel)
    private readonly taskModel: typeof TaskModel,
    @InjectModel(TaskTagModel)
    private readonly taskTagModel: typeof TaskTagModel
  ) {
    super(taskModel, ['creator', 'assignee', 'category'])
  }

  async findByCreatorId(
    creatorId: string,
    options?: IDatabaseFindAllOptions
  ): Promise<TaskModel[]> {
    return this.findAll({ creatorId }, options)
  }

  async findByAssigneeId(
    assigneeId: string,
    options?: IDatabaseFindAllOptions
  ): Promise<TaskModel[]> {
    return this.findAll({ assigneeId }, options)
  }

  async findByCategoryId(
    categoryId: string,
    options?: IDatabaseFindAllOptions
  ): Promise<TaskModel[]> {
    return this.findAll({ categoryId }, options)
  }

  async findByStatus(status: TaskStatus, options?: IDatabaseFindAllOptions): Promise<TaskModel[]> {
    return this.findAll({ status }, options)
  }

  async createOne(data: Partial<TaskModel>): Promise<TaskModel> {
    return this.create(data)
  }

  async updateOneById(id: string, data: Partial<TaskModel>): Promise<TaskModel> {
    const task = await this.findOneById(id)
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }
    Object.assign(task, data)
    return this.save(task)
  }

  async deleteOneById(id: string): Promise<boolean> {
    const task = await this.findOneById(id)
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }
    await this.delete(task)
    return true
  }

  async findTaskTags(taskId: string, options?: IDatabaseFindAllOptions): Promise<TaskTagModel[]> {
    const findOptions: FindOptions = {
      where: { taskId },
    }

    if (options?.limit) findOptions.limit = options.limit
    if (options?.skip) findOptions.offset = options.skip
    if (options?.order) {
      findOptions.order = Object.entries(options.order).map(([key, value]) => [key, value])
    }

    return this.taskTagModel.findAll(findOptions)
  }

  async addTagToTask(taskId: string, tagId: string): Promise<TaskTagModel> {
    return this.taskTagModel.create({ taskId, tagId })
  }

  async removeTagFromTask(taskId: string, tagId: string): Promise<boolean> {
    const result = await this.taskTagModel.destroy({
      where: { taskId, tagId },
    })
    return result > 0
  }

  async removeAllTagsFromTask(taskId: string): Promise<boolean> {
    const result = await this.taskTagModel.destroy({
      where: { taskId },
    })
    return result > 0
  }
}
