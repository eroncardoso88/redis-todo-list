type FilterType = 'all' | 'active' | 'completed';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function TodoFilters({ currentFilter, onFilterChange }: TodoFiltersProps) {
  return (
    <div className="flex space-x-2 text-sm">
      <button
        className={`px-2 py-1 rounded-md ${currentFilter === 'all' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
        onClick={() => onFilterChange('all')}
      >
        All
      </button>
      <button
        className={`px-2 py-1 rounded-md ${currentFilter === 'active' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
        onClick={() => onFilterChange('active')}
      >
        Active
      </button>
      <button
        className={`px-2 py-1 rounded-md ${currentFilter === 'completed' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </button>
    </div>
  );
}