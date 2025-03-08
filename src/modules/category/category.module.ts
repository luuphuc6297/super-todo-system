import { InfrasModule } from '@infras/infras.module'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CategoryModel } from './models/category.model'
import { CategoryRepository } from './repositories/category.repository'
import { CategoryService } from './services/category.service'

@Module({
  imports: [SequelizeModule.forFeature([CategoryModel]), InfrasModule],
  controllers: [],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
