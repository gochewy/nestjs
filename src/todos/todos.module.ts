import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TodosResolver } from './todos.resolvers';

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [TodosController],
  providers: [TodosService, TodosResolver],
})
export class TodosModule {}
