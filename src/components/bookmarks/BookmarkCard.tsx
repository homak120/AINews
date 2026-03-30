import { Link } from 'react-router-dom';
import type { NewsItem, Topic } from '../../types';
import { TOPIC_DISPLAY_NAMES } from '../../types';

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

interface BookmarkCardProps {
  item: NewsItem;
  note?: string;
}

export function BookmarkCard({ item, note }: BookmarkCardProps) {
  const primaryTopic = item.topics[0] as Topic | undefined;
  const accentClass = primaryTopic ? TOPIC_ACCENT[primaryTopic] : TOPIC_ACCENT['ai-engineering'];
  const topicLabel = primaryTopic ? TOPIC_DISPLAY_NAMES[primaryTopic] : '';
  const typeLabel = TYPE_LABELS[item.type] ?? item.type.toUpperCase();
  const notePreview = note ? note.slice(0, 80) + (note.length > 80 ? '…' : '') : '';

  return (
    <Link to={`/item/${item.id}`} className="block group">
      <article className="
        relative overflow-hidden
        bg-white/[0.06] backdrop-blur-xl
        border border-cyan-400/22 rounded-2xl p-6
        transition-all duration-200
        hover:bg-white/[0.10] hover:border-white/[0.20] hover:-translate-y-0.5
        before:absolute before:top-0 before:inset-x-0 before:h-px
        before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      ">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-block font-mono text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border ${accentClass}`}>
                {typeLabel}
              </span>
              {topicLabel && (
                <span className="text-xs text-slate-500 font-mono truncate">{topicLabel}</span>
              )}
            </div>
            <h3 className="text-[15px] font-semibold leading-snug text-slate-100 line-clamp-2">
              {item.title}
            </h3>
            {notePreview && (
              <p className="text-xs text-slate-500 font-mono mt-2 italic">"{notePreview}"</p>
            )}
          </div>
          <svg className="w-4 h-4 flex-shrink-0 text-cyan-400 mt-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
      </article>
    </Link>
  );
}
