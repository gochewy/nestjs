import { Body, Controller, Get, Post } from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}
  @Get()
  async getNameOfTodo() {
    return this.todosService.getNameOfTodo();
  }
  @Post('/modifyDocument')
  async modifyDocument(@Body() document: any) {
    return this.todosService.modifyDocument(document);
  }
}
