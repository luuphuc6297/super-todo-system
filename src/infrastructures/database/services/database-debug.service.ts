import { Injectable, Logger } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { InjectConnection } from '@nestjs/sequelize'

@Injectable()
export class DatabaseDebugService {
  private readonly logger = new Logger(DatabaseDebugService.name)

  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * List all tables in the database
   */
  async listTables(): Promise<string[]> {
    try {
      const tables = await this.sequelize.query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
        { type: 'SELECT' }
      )
      
      const tableNames = tables.map((t: any) => t.name)
      this.logger.log('List of tables:')
      this.logger.log(tableNames)
      
      return tableNames
    } catch (error) {
      this.logger.error(`Error listing tables: ${error.message}`)
      return []
    }
  }

  /**
   * Get data from a specific table
   * @param tableName Name of the table to query
   */
  async getTableData(tableName: string): Promise<any[]> {
    try {
      // Check if the table exists
      const tables = await this.listTables()
      if (!tables.includes(tableName)) {
        this.logger.warn(`Table ${tableName} does not exist`)
        return []
      }

      const records = await this.sequelize.query(`SELECT * FROM "${tableName}"`, {
        type: 'SELECT',
      })
      
      this.logger.log(`Retrieved ${records.length} records from table ${tableName}`)
      return records
    } catch (error) {
      this.logger.error(`Error retrieving data from table ${tableName}: ${error.message}`)
      return []
    }
  }
} 