import { AppHelloSerialization } from '@app/serializations/app.hello.serialization'
import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

export function AppHelloDoc(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Say hello',
      description: 'Return a hello message',
    }),
    ApiResponse({
      status: 200,
      description: 'Hello message',
      type: AppHelloSerialization,
    })
  )
}
