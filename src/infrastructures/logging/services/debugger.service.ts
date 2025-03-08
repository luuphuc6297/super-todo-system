import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as util from 'util'

@Injectable()
export class DebuggerService {
  private readonly isDebugEnabled: boolean

  constructor(private readonly configService: ConfigService) {
    this.isDebugEnabled = this.configService.get<boolean>('app.debug') || false
  }

  debug(context: string, ...data: any[]): void {
    if (!this.isDebugEnabled) {
      return
    }

    const now = new Date()
    const timestamp = `${now.toISOString()}`
    const formattedData = data.map((item) => {
      if (typeof item === 'object') {
        return util.inspect(item, { depth: null, colors: true })
      }
      return item
    })

    console.log(`[DEBUG] ${timestamp} [${context}]:`, ...formattedData)
  }

  log(context: string, ...data: any[]): void {
    this.debug(context, ...data)
  }

  table(context: string, tableData: any[]): void {
    if (!this.isDebugEnabled) {
      return
    }

    console.log(`[DEBUG TABLE] [${context}]:`)
    console.table(tableData)
  }

  time(context: string, label: string): void {
    if (!this.isDebugEnabled) {
      return
    }

    console.time(`[DEBUG TIME] [${context}] ${label}`)
  }

  timeEnd(context: string, label: string): void {
    if (!this.isDebugEnabled) {
      return
    }

    console.timeEnd(`[DEBUG TIME] [${context}] ${label}`)
  }
}
