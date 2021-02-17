import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TASKS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:bitnami@localhost:5672/'],
          queue: 'tasks',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
