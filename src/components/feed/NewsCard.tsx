import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useBookmarks } from '../../hooks/useBookmarks';
import { useKnowledgeChecks } from '../../hooks/useKnowledgeChecks';
import type { NewsItem, Topic } from '../../types';

const TOPIC_ACCENT: Record<Topic, { tag: string; border: string }> = {
  'ai-engineering': {
    tag:    'bg-violet-500/10 border-violet-500/25 text-violet-400',
    border: 'border-violet-400/22',
  },
  'ai-research': {
    tag:    'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
    border: 'border-cyan-400/22',
  },
  'ai-career': {
    tag:    'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
    border: 'border-emerald-400/22',
  },
  'ai-industry': {
    tag:    'bg-amber-500/10 border-amber-500/25 text-amber-400',
    border: 'border-amber-400/22',
  },
};

const TYPE_LABELS: Record<string, string> = {
  video:   'VIDEO',
  article: 'ARTICLE',
  paper:   'PAPER',
  social:  'POST',
};

interface NewsCardProps {
  item: NewsItem;
  primaryTopic: Topic;
}

export function NewsCard({ item, primaryTopic }: NewsCardProps) {
  const accent = TOPIC_ACCENT[primaryTopic];
  const typeLabel = TYPE_LABELS[item.type] ?? item.type.toUpperCase();

  const { toggle, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(item.id);

  const { isCompleted } = useKnowledgeChecks();
  const checked = isCompleted(item.id) && item.knowledgeChecks.length > 0;

  const date = new Date(item.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const sourceDomain = (() => {
    try {
      return new URL(item.sourceUrl).hostname.replace('www.', '');
    } catch {
      return item.sourceUrl;
    }
  })();

  return (
    <Link to={`/item/${item.id}`} className="block group">
      <article
        className={cn(
          'relative overflow-hidden',
          'bg-white/[0.06] backdrop-blur-xl',
          'border rounded-2xl p-7',
          'transition-all duration-200',
          'hover:bg-white/[0.10] hover:border-white/[0.20] hover:-translate-y-0.5',
          'before:absolute before:top-0 before:inset-x-0 before:h-px',
          'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
          bookmarked ? accent.border : 'border-white/[0.12]'
        )}
      >
        <header className="flex items-start justify-between gap-2 mb-3">
          <span
            className={cn(
              'inline-block font-mono text-[11px] font-semibold tracking-widest uppercase',
              'px-2.5 py-1 rounded-full border',
              accent.tag
            )}
          >
            {typeLabel}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(item.id);
            }}
            className={cn(
              'flex-shrink-0 mt-0.5 transition-colors',
              bookmarked ? 'text-cyan-400' : 'text-slate-600 hover:text-cyan-400'
            )}
          >
            <svg
              className="w-4 h-4"
              fill={bookmarked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </header>

        <h2 className="text-[15px] font-semibold leading-snug text-slate-100 line-clamp-2">
          {item.title}
        </h2>

        <p className="text-sm leading-relaxed text-slate-400 line-clamp-3 mt-2">
          {item.summary}
        </p>

        <footer className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.06]">
          <span className="text-xs text-slate-500 font-mono">{sourceDomain}</span>
          {checked && (
            <span className="text-[10px] font-mono font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              ✓ Checked
            </span>
          )}
          <span className="text-xs text-slate-500 font-mono ml-auto">{date}</span>
        </footer>
      </article>
    </Link>
  );
}
