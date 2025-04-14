// backend/src/todos/todos.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(@Request() req): Promise<Todo[]> {
    return this.todosService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req): Promise<Todo> {
    return this.todosService.findOne(+id, req.user.id);
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto, @Request() req): Promise<Todo> {
    return this.todosService.create(createTodoDto, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ): Promise<Todo> {
    return this.todosService.update(+id, updateTodoDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.todosService.remove(+id, req.user.id);
  }
}