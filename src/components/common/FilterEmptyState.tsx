interface FilterEmptyStateProps {
  message: string;
  onClear: () => void;
}

export function FilterEmptyState({ message, onClear }: FilterEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-slate-500 text-sm mb-3">{message}</p>
      <button
        onClick={onClear}
        className="text-xs text-cyan-400 font-mono hover:underline transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
}
