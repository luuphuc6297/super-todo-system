import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTagDto {
  @ApiProperty({
    description: 'Tag name',
    example: 'Important',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({
    description: 'Tag color (hex code)',
    example: '#FF5733',
  })
  @IsString()
  @IsOptional()
  color?: string
}
