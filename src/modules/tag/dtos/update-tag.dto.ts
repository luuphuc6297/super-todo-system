import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateTagDto {
  @ApiPropertyOptional({
    description: 'Tag name',
    example: 'Important',
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({
    description: 'Tag color (hex code)',
    example: '#FF5733',
  })
  @IsString()
  @IsOptional()
  color?: string
}
