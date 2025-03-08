import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { PaymentModel } from './models/payment.model'
import { InfrasModule } from '@infras/infras.module'

@Module({
  imports: [
    SequelizeModule.forFeature([PaymentModel]),
    InfrasModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class PaymentModule {} 