import { Injectable } from '@nestjs/common';
import { AppHelloSerialization } from '@app/serializations/app.hello.serialization';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  hello(): AppHelloSerialization {
    return {
      message: `Hello from ${this.configService.get<string>('app.name')}`,
    };
  }
} 