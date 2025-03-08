import { Module } from '@nestjs/common'
import { CategoryModule } from '../../modules/category/category.module'
import { CategoryController } from '../../modules/category/controllers/category.controller'

@Module({
  controllers: [CategoryController],
  providers: [],
  exports: [],
  imports: [CategoryModule],
})
export class RoutesCategoryModule {} 