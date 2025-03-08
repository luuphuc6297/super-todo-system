import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { TagModel } from './models/tag.model'
import { TagRepository } from './repositories/tag.repository'
import { TagService } from './services/tag.service'
import { TaskTagModel } from '@modules/task/models/task-tag.model'
import { InfrasModule } from '@infras/infras.module'

@Module({
  imports: [
    SequelizeModule.forFeature([TagModel, TaskTagModel]),
    InfrasModule
  ],
  controllers: [],
  providers: [TagRepository, TagService],
  exports: [TagService],
})
export class TagModule {}
