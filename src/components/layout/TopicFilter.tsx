import { cn } from '../../utils/cn';
import { TOPIC_DISPLAY_NAMES, type Topic } from '../../types';

const TOPICS = Object.keys(TOPIC_DISPLAY_NAMES) as Topic[];

const ACTIVE_CHIP: Record<Topic, string> = {
  'ai-engineering': 'bg-violet-500/15 border-violet-500/30 text-violet-400',
  'ai-research':   'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
  'ai-career':     'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  'ai-industry':   'bg-amber-500/15 border-amber-500/30 text-amber-400',
};

interface TopicFilterProps {
  active: Topic | null;
  onSelect: (topic: Topic | null) => void;
}

export function TopicFilter({ active, onSelect }: TopicFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-nowrap overflow-x-auto pb-1">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 border',
          active === null
            ? 'bg-violet-500/15 border-violet-500/30 text-violet-400'
            : 'bg-white/[0.04] border-white/[0.10] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200'
        )}
      >
        All
      </button>
      {TOPICS.map((topic) => (
        <button
          key={topic}
          onClick={() => onSelect(topic)}
          className={cn(
            'flex-shrink-0 rounded-full px-4 py-1.5 text-xs transition-all duration-200 border',
            active === topic
              ? `${ACTIVE_CHIP[topic]} font-semibold`
              : 'bg-white/[0.04] border-white/[0.10] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200'
          )}
        >
          {TOPIC_DISPLAY_NAMES[topic]}
        </button>
      ))}
    </div>
  );
}
