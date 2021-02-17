import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
