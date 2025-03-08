import { Module } from '@nestjs/common'
import { TagModule } from '@modules/tag/tag.module'
import { TagController } from '@modules/tag/controllers/tag.controller'

@Module({
  imports: [TagModule],
  controllers: [TagController],
  providers: [],
  exports: [],
})
export class RoutesTagModule {} 