import { cn } from '../../utils/cn';

interface TagChipsProps {
  tags: string[];
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}

export function TagChips({ tags, activeTag, onTagClick }: TagChipsProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onTagClick(tag);
          }}
          className={cn(
            'flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-mono cursor-pointer transition-all duration-150 border',
            activeTag === tag
              ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400'
              : 'bg-white/[0.04] border-white/[0.08] text-slate-500 hover:bg-white/[0.08] hover:text-slate-300'
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
