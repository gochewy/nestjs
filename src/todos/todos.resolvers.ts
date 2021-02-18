import { Context, Query, Resolver } from '@nestjs/graphql';
import { TodosService } from './todos.service';
import { UseGuards } from '@nestjs/common';
import { Todo } from './models/todos.model';
import { Args } from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';

@Resolver()
export class TodosResolver {
  constructor(private readonly todosService: TodosService) {}
  @Query((returns) => [Todo])
  @UseGuards(AuthGuard)
  async searchTodo(@Args('q') q: string, @Context() context) {
    return this.todosService.search(q, context);
  }
}
