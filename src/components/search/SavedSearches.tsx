import { useState } from 'react';
import { cn } from '../../utils/cn';
import type { FilterState, SavedSearch } from '../../types';

interface SavedSearchesProps {
  savedSearches: SavedSearch[];
  onSave: (name: string) => void;
  onLoad: (filters: FilterState) => void;
  onDelete: (id: string) => void;
  hasActiveFilters: boolean;
  isAtLimit: boolean;
}

export function SavedSearches({
  savedSearches,
  onSave,
  onLoad,
  onDelete,
  hasActiveFilters,
  isAtLimit,
}: SavedSearchesProps) {
  const [isNaming, setIsNaming] = useState(false);
  const [name, setName] = useState('');
  const [limitMessage, setLimitMessage] = useState(false);

  const handleSave = () => {
    if (isAtLimit) {
      setLimitMessage(true);
      setTimeout(() => setLimitMessage(false), 3000);
      return;
    }
    setIsNaming(true);
    setName('');
  };

  const handleSubmit = () => {
    if (name.trim()) {
      onSave(name.trim());
      setIsNaming(false);
      setName('');
    }
  };

  if (savedSearches.length === 0 && !hasActiveFilters) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      {savedSearches.map((search) => (
        <div
          key={search.id}
          className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-mono bg-white/[0.06] border border-white/[0.12] text-slate-300 transition-all duration-150 hover:bg-white/[0.10]"
        >
          <button
            onClick={() => onLoad(search.filters)}
            className="hover:text-white transition-colors"
          >
            {search.name}
          </button>
          <button
            onClick={() => onDelete(search.id)}
            className="text-slate-600 hover:text-red-400 transition-colors ml-1"
          >
            ×
          </button>
        </div>
      ))}

      {hasActiveFilters && !isNaming && (
        <button
          onClick={handleSave}
          className={cn(
            'rounded-full px-3 py-1.5 text-xs font-mono border transition-all duration-150',
            'bg-white/[0.04] border-white/[0.10] text-slate-500 hover:text-slate-300 hover:bg-white/[0.08]'
          )}
        >
          + Save search
        </button>
      )}

      {isNaming && (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
              if (e.key === 'Escape') setIsNaming(false);
            }}
            placeholder="Search name..."
            autoFocus
            className="bg-white/[0.07] border border-white/[0.15] rounded-lg text-slate-100 text-xs px-2.5 py-1.5 w-32 focus:outline-none focus:border-cyan-400/40 transition-colors"
          />
          <button
            onClick={handleSubmit}
            className="text-xs text-cyan-400 font-mono hover:underline"
          >
            Save
          </button>
          <button
            onClick={() => setIsNaming(false)}
            className="text-xs text-slate-600 font-mono hover:text-slate-400"
          >
            Cancel
          </button>
        </div>
      )}

      {limitMessage && (
        <span className="text-xs text-amber-400 font-mono">
          Maximum 5 saved searches. Delete one to save a new one.
        </span>
      )}
    </div>
  );
}
