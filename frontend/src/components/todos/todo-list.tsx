import { useTodos } from '@/src/hooks/useTodos';
import { useState } from 'react';
import { NewTodoForm } from './new-todo-form';
import { TodoCounter } from './todo-counter';
import { TodoFilters } from './todo-filters';
import { TodoItem } from './todo-item';

type FilterType = 'all' | 'active' | 'completed';

export function TodoList() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { data: todos = [], isLoading, error } = useTodos();

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg my-4">
        Error loading todos. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <NewTodoForm />
      </div>

      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <TodoCounter count={activeTodosCount} />
        <TodoFilters currentFilter={filter} onFilterChange={setFilter} />
      </div>

      <div className="divide-y divide-gray-200">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No tasks match your filter
          </div>
        )}
      </div>
    </div>
  );
}