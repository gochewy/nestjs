import {
  Controller,
  Get,
  Inject,
  OnApplicationBootstrap,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController implements OnApplicationBootstrap {
  constructor(@Inject('TASKS_SERVICE') private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  @Get()
  async getHello(@Query('greeting') greeting?: string) {
    this.client.emit('hello', { value: greeting || 'hello' });

    return 'potato';
  }
}
