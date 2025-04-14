// backend/src/todos/todos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  async findAll(userId: number): Promise<Todo[]> {
    return this.todosRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id, userId },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    const todo = this.todosRepository.create({
      ...createTodoDto,
      userId,
    });

    return this.todosRepository.save(todo);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, userId: number): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    
    Object.assign(todo, updateTodoDto);
    
    return this.todosRepository.save(todo);
  }

  async remove(id: number, userId: number): Promise<void> {
    const todo = await this.findOne(id, userId);
    await this.todosRepository.remove(todo);
  }
}