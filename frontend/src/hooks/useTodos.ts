import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import todoService, { CreateTodoInput, UpdateTodoInput } from '../services/todo-service';

export const TODOS_QUERY_KEY = 'todos';

export function useTodos() {
  return useQuery({
    queryKey: [TODOS_QUERY_KEY],
    queryFn: () => todoService.getTodos(),
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (todo: CreateTodoInput) => todoService.createTodo(todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: UpdateTodoInput }) => 
      todoService.updateTodo(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => todoService.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}

export function useToggleTodoCompletion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) => 
      todoService.toggleTodoCompletion(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_QUERY_KEY] });
    },
  });
}