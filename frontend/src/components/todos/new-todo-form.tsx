import { useCreateTodo } from '@/src/hooks/useTodos';
import { useState } from 'react';

export function NewTodoForm() {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const createTodoMutation = useCreateTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim() === '') return;
    
    createTodoMutation.mutate(
      { title: newTodoTitle.trim() },
      {
        onSuccess: () => {
          setNewTodoTitle('');
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        placeholder="Add a new task..."
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        className="flex-1 rounded-l-md border-r-0 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      />
      <button
        type="submit"
        disabled={createTodoMutation.isPending || newTodoTitle.trim() === ''}
        className={`px-4 py-2 rounded-r-md font-medium text-white ${
          createTodoMutation.isPending || newTodoTitle.trim() === ''
            ? 'bg-blue-300'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {createTodoMutation.isPending ? (
          <div className="flex items-center justify-center">
            <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin"></div>
          </div>
        ) : (
          'Add'
        )}
      </button>
    </form>
  );
}