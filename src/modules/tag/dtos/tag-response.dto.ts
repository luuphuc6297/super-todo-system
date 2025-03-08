import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class TagResponseDto {
  @ApiProperty({
    description: 'Tag ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string

  @ApiProperty({
    description: 'Tag name',
    example: 'Important',
  })
  name: string

  @ApiPropertyOptional({
    description: 'Tag color (hex code)',
    example: '#FF5733',
  })
  color?: string

  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date
}
