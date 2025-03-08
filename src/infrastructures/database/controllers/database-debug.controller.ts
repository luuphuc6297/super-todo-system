import { Controller, Get, Param, Logger } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { DatabaseDebugService } from '../services/database-debug.service'

@ApiTags('Database Debug')
@Controller('debug')
export class DatabaseDebugController {
  private readonly logger = new Logger(DatabaseDebugController.name)

  constructor(private readonly databaseDebugService: DatabaseDebugService) {}

  @Get('tables')
  @ApiOperation({ summary: 'List all tables in the database' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of tables in the database',
    schema: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  })
  async listTables() {
    this.logger.log('Fetching list of tables...')
    return this.databaseDebugService.listTables()
  }

  @Get('tables/:tableName')
  @ApiOperation({ summary: 'View data from a specific table' })
  @ApiParam({ name: 'tableName', description: 'Name of the table to view data from' })
  @ApiResponse({ 
    status: 200, 
    description: 'Table data',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: true
      }
    }
  })
  async getTableData(@Param('tableName') tableName: string) {
    this.logger.log(`Fetching data from table ${tableName}...`)
    return this.databaseDebugService.getTableData(tableName)
  }
}
