import { ApiProperty } from '@nestjs/swagger'

export class AppHelloSerialization {
  @ApiProperty({
    description: 'Hello message',
    example: 'Hello from CoverGo Coding Challenge',
  })
  message: string
}
