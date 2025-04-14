// backend/src/todos/dto/update-todo.dto.ts
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}