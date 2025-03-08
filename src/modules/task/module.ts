import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { TaskModel } from './models/task.model'
import { TaskController } from './controllers/task.controller'
import { TaskService } from './services/task.service'
import { TaskRepository } from './repositories/task.repository'

@Module({
  imports: [SequelizeModule.forFeature([TaskModel])],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService],
})
export class TaskModule {}
