// frontend/src/components/todos/todo-app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodoList } from './todo-list';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function TodoApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>
  );
}