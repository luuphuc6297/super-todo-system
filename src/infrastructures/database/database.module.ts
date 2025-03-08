import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SeedModule } from '../seed/seed.module'
import { DatabaseDebugController } from './controllers/database-debug.controller'
import { DatabaseDebugService } from './services/database-debug.service'

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: ':memory:',
      autoLoadModels: true,
      synchronize: true,
      logging: true,
      dialectModule: require('sqlite3'),
    }),
    SeedModule,
  ],
  controllers: [DatabaseDebugController],
  providers: [DatabaseDebugService],
  exports: [SeedModule, DatabaseDebugService],
})
export class DatabaseModule {}
