import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { formatDate } from '../../utils/formatDate';
import type { NewsItem, Topic } from '../../types';
import { TOPIC_DISPLAY_NAMES } from '../../types';
import { useBookmarks } from '../../hooks/useBookmarks';
import { useNotes } from '../../hooks/useNotes';
import { VideoPlayer } from './VideoPlayer';
import { Breakdown } from './Breakdown';
import { KnowledgeCheck } from './KnowledgeCheck';
import { RelatedContent } from './RelatedContent';

const TOPIC_ACCENT: Record<Topic, string> = {
  'ai-engineering': 'bg-violet-500/10 border-violet-500/25 text-violet-400',
  'ai-research':   'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
  'ai-career':     'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
  'ai-industry':   'bg-amber-500/10 border-amber-500/25 text-amber-400',
};

const TYPE_LABELS: Record<string, string> = {
  video:   'Video',
  article: 'Article',
  paper:   'Research Paper',
  social:  'Social Post',
};

interface ItemDetailProps {
  item: NewsItem;
}

export function ItemDetail({ item }: ItemDetailProps) {
  const navigate = useNavigate();
  const primaryTopic = item.topics[0] as Topic | undefined;
  const accentClass = primaryTopic ? TOPIC_ACCENT[primaryTopic] : TOPIC_ACCENT['ai-engineering'];
  const topicLabel = primaryTopic ? TOPIC_DISPLAY_NAMES[primaryTopic] : '';
  const typeLabel = TYPE_LABELS[item.type] ?? item.type;
  const hasQuiz = item.knowledgeChecks.length > 0;

  const { toggle, isBookmarked } = useBookmarks();
  const { getNote, setNote } = useNotes();
  const bookmarked = isBookmarked(item.id);
  const note = getNote(item.id);

  const date = formatDate(item.publishedAt);

  const sourceDomain = (() => {
    try {
      return new URL(item.sourceUrl).hostname.replace('www.', '');
    } catch {
      return item.sourceUrl;
    }
  })();

  return (
    <div className={hasQuiz ? 'grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start' : 'grid grid-cols-1 gap-6'}>
      {/* Article panel */}
      <div className="
        relative overflow-hidden
        bg-white/[0.06] backdrop-blur-xl
        border border-white/[0.12]
        rounded-2xl p-4 sm:p-8
        before:absolute before:top-0 before:inset-x-0 before:h-px
        before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      ">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-slate-500 font-mono hover:text-cyan-400 transition-colors"
          >
            ← Back to feed
          </Link>
          <button
            onClick={() => toggle(item.id)}
            className={cn(
              'flex items-center gap-1.5 text-xs font-mono transition-colors',
              bookmarked ? 'text-cyan-400' : 'text-slate-500 hover:text-cyan-400'
            )}
          >
            <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" />
            </svg>
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        </div>

        {/* Topic + date row */}
        <div className="flex items-center gap-3 mb-4">
          {primaryTopic && (
            <span className={`inline-block font-mono text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full border ${accentClass}`}>
              {topicLabel}
            </span>
          )}
          <span className="text-xs text-slate-500 font-mono">
            {sourceDomain} · {date}
          </span>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {item.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/?tag=${encodeURIComponent(tag)}`)}
                className="rounded-full px-2.5 py-0.5 text-[10px] font-mono cursor-pointer transition-all duration-150 border bg-white/[0.04] border-white/[0.08] text-slate-500 hover:bg-white/[0.08] hover:text-slate-300"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <h1 className="text-2xl font-bold leading-snug text-slate-100 mb-4">
          {item.title}
        </h1>

        {/* Metadata row */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-6">
          {[
            { key: 'Source', val: sourceDomain },
            { key: 'Published', val: date },
            { key: 'Type', val: typeLabel },
          ].map((m) => (
            <div key={m.key} className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-[0.08em] text-slate-500 font-mono">{m.key}</span>
              <span className="text-[13px] text-slate-400">{m.val}</span>
            </div>
          ))}
        </div>

        <hr className="border-white/[0.08] my-5" />

        {/* Video embed if applicable */}
        {item.type === 'video' && item.youtubeId && (
          <VideoPlayer
            youtubeId={item.youtubeId}
            sourceUrl={item.sourceUrl}
            title={item.title}
          />
        )}

        <Breakdown
          summary={item.summary}
          keyConcepts={item.keyConcepts}
          whyItMatters={item.whyItMatters}
          topicAccent={accentClass}
        />

        <hr className="border-white/[0.08] my-5" />

        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[13px] text-cyan-400 font-mono hover:underline"
        >
          → Read full {typeLabel.toLowerCase()}
        </a>

        {item.relatedIds.length > 0 && (
          <RelatedContent relatedIds={item.relatedIds} />
        )}

        <hr className="border-white/[0.08] my-5" />

        <div>
          <h2 className="text-[11px] font-mono font-semibold tracking-[0.08em] uppercase text-slate-500 mb-2">
            My Notes
          </h2>
          <textarea
            defaultValue={note}
            onChange={(e) => setNote(item.id, e.target.value)}
            rows={4}
            placeholder="Add your thoughts…"
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/[0.04] border border-white/[0.10]
              text-sm text-slate-300 placeholder:text-slate-600
              focus:outline-none focus:border-cyan-400/40
              resize-none transition-colors duration-200
            "
          />
        </div>
      </div>

      {/* Knowledge Check sidebar */}
      {hasQuiz && (
        <KnowledgeCheck item={item} />
      )}
    </div>
  );
}
