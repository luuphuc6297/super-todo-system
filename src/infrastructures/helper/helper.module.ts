import { Global, Module } from '@nestjs/common'
import { HelperDateService } from './services/helper.date.service'
import { HelperHashService } from './services/helper.hash.service'
import { HelperStringService } from './services/helper.string.service'

@Global()
@Module({
  providers: [HelperDateService, HelperHashService, HelperStringService],
  exports: [HelperDateService, HelperHashService, HelperStringService],
})
export class HelperModule {}
