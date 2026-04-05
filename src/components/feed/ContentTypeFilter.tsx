import { cn } from '../../utils/cn';
import type { ContentTypeFilterValue } from '../../types';

const OPTIONS: { value: ContentTypeFilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'video', label: 'Video' },
  { value: 'article', label: 'Article' },
  { value: 'paper', label: 'Paper' },
  { value: 'social', label: 'Social' },
];

interface ContentTypeFilterProps {
  value: ContentTypeFilterValue;
  onChange: (value: ContentTypeFilterValue) => void;
}

export function ContentTypeFilter({ value, onChange }: ContentTypeFilterProps) {
  return (
    <div className="flex items-center gap-1 flex-nowrap overflow-x-auto">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex-shrink-0 rounded-full px-4 py-1.5 text-xs transition-all duration-200 border',
            value === opt.value
              ? 'bg-white/[0.12] text-white border-white/[0.20] font-semibold'
              : 'bg-white/[0.04] border-white/[0.10] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
