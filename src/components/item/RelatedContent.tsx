import { Link } from 'react-router-dom';
import { useNews } from '../../hooks/useNews';
import type { Topic } from '../../types';

const TYPE_LABELS: Record<string, string> = {
  video:   'VIDEO',
  article: 'ARTICLE',
  paper:   'PAPER',
  social:  'POST',
};

const TOPIC_ACCENT: Record<Topic, string> = {
  'ai-engineering': 'bg-violet-500/10 border-violet-500/25 text-violet-400',
  'ai-research':   'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
  'ai-career':     'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
  'ai-industry':   'bg-amber-500/10 border-amber-500/25 text-amber-400',
};

interface RelatedContentProps {
  relatedIds: string[];
}

export function RelatedContent({ relatedIds }: RelatedContentProps) {
  const { getById } = useNews();

  const relatedItems = relatedIds
    .map((id) => getById(id))
    .filter((item) => item !== undefined);

  if (relatedItems.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-[11px] font-mono font-semibold tracking-[0.08em] uppercase text-slate-500 mb-4">
        Related Content
      </h2>
      <div className="flex flex-col gap-3">
        {relatedItems.map((item) => {
          const primaryTopic = item.topics[0] as Topic | undefined;
          const accentClass = primaryTopic ? TOPIC_ACCENT[primaryTopic] : TOPIC_ACCENT['ai-engineering'];
          const typeLabel = TYPE_LABELS[item.type] ?? item.type.toUpperCase();

          return (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              className="
                flex items-center gap-3 p-4
                bg-white/[0.04] border border-white/[0.08] rounded-xl
                hover:bg-white/[0.08] hover:border-white/[0.15]
                transition-all duration-150 group
              "
            >
              <span className={`flex-shrink-0 font-mono text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full border ${accentClass}`}>
                {typeLabel}
              </span>
              <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors line-clamp-1">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
