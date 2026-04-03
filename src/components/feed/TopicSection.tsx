import { cn } from '../../utils/cn';
import { TOPIC_DISPLAY_NAMES, type NewsItem, type Topic } from '../../types';
import { NewsCard } from './NewsCard';
import { FilterEmptyState } from '../common/FilterEmptyState';

const COLUMN_ACCENT: Record<Topic, string> = {
  'ai-engineering': 'bg-violet-500/[0.08] border-violet-500/25 text-violet-400',
  'ai-research':   'bg-cyan-500/[0.08] border-cyan-500/25 text-cyan-400',
  'ai-career':     'bg-emerald-500/[0.08] border-emerald-500/25 text-emerald-400',
  'ai-industry':   'bg-amber-500/[0.08] border-amber-500/25 text-amber-400',
};

interface TopicSectionProps {
  topic: Topic;
  items: NewsItem[];
  activeTag?: string | null;
  onTagClick?: (tag: string | null) => void;
  contentTypeLabel?: string;
}

export function TopicSection({ topic, items, activeTag, onTagClick, contentTypeLabel }: TopicSectionProps) {
  const accentClasses = COLUMN_ACCENT[topic];

  return (
    <div className="flex flex-col gap-4">
      {/* Sticky column header */}
      <div
        className={cn(
          'sticky top-[56px] z-10',
          'backdrop-blur-md border rounded-t-2xl',
          'px-4 py-3',
          'flex items-center justify-between',
          accentClasses
        )}
      >
        <span className="font-mono text-[11px] font-semibold tracking-widest uppercase">
          {TOPIC_DISPLAY_NAMES[topic]}
        </span>
        <span className="text-xs text-slate-500 font-mono">{items.length}</span>
      </div>

      {/* Cards or empty state */}
      {items.length === 0 ? (
        contentTypeLabel ? (
          <FilterEmptyState
            message={`No ${contentTypeLabel} items in this topic`}
            onClear={() => {/* handled by parent reset */}}
          />
        ) : (
          <div className="py-8 text-center text-sm text-slate-600">
            No items in this topic yet.
          </div>
        )
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              primaryTopic={topic}
              activeTag={activeTag ?? null}
              onTagClick={onTagClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
