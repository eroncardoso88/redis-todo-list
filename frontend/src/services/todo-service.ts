import axios, { AxiosInstance } from 'axios';
import authService from './auth-service';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTodoInput {
  title: string;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

class TodoService {
  private api: AxiosInstance;
  private baseUrl: string = 'http://localhost:3000';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = authService.getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getTodos(): Promise<Todo[]> {
    try {
      const response = await this.api.get('/todos');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching todos:', error);
      throw error.response?.data?.message || 'Failed to fetch todos';
    }
  }

  async createTodo(todo: CreateTodoInput): Promise<Todo> {
    try {
      const response = await this.api.post('/todos', todo);
      return response.data;
    } catch (error: any) {
      console.error('Error creating todo:', error);
      throw error.response?.data?.message || 'Failed to create todo';
    }
  }

  async updateTodo(id: number, updates: UpdateTodoInput): Promise<Todo> {
    try {
      const response = await this.api.patch(`/todos/${id}`, updates);
      return response.data;
    } catch (error: any) {
      console.error('Error updating todo:', error);
      throw error.response?.data?.message || 'Failed to update todo';
    }
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      await this.api.delete(`/todos/${id}`);
    } catch (error: any) {
      console.error('Error deleting todo:', error);
      throw error.response?.data?.message || 'Failed to delete todo';
    }
  }

  async toggleTodoCompletion(id: number, completed: boolean): Promise<Todo> {
    return this.updateTodo(id, { completed });
  }
}

export const todoService = new TodoService();
export default todoService;