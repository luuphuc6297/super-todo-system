import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { TaskController } from './controllers/task.controller'
import { TaskTagModel } from './models/task-tag.model'
import { TaskModel } from './models/task.model'
import { TaskRepository } from './repositories/task.repository'
import { TaskService } from './services/task.service'
import { InfrasModule } from '@infras/infras.module'

@Module({
  imports: [
    SequelizeModule.forFeature([TaskModel, TaskTagModel]),
    InfrasModule
  ],
  controllers: [],
  providers: [TaskRepository, TaskService],
  exports: [TaskService, TaskRepository],
})
export class TaskModule {}
