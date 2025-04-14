interface TodoCounterProps {
  count: number;
}

export function TodoCounter({ count }: TodoCounterProps) {
  return (
    <div className="text-sm text-gray-500">
      {count === 0 ? (
        <span>All tasks completed!</span>
      ) : (
        <span>{count} {count === 1 ? 'task' : 'tasks'} remaining</span>
      )}
    </div>
  );
}