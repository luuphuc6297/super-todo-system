import { UserRole } from '@modules/user/models/user.model'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreateTaskTagDto {
  @ApiProperty({
    description: 'Tag ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  tagId: string

  // Not sent from client, added by controller
  userRole?: UserRole
}
