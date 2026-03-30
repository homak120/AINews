import { Link } from 'react-router-dom';

interface HeaderProps {
  onSearch: (query: string) => void;
  bookmarkCount?: number;
}

export function Header({ onSearch, bookmarkCount = 0 }: HeaderProps) {
  return (
    <nav className="
      sticky top-0 z-20
      bg-[#0d1526]/80 backdrop-blur-md
      border-b border-white/[0.08]
      px-8 py-4
      flex items-center justify-between
    ">
      {/* Wordmark */}
      <Link to="/" className="text-slate-100 font-semibold text-lg tracking-tight flex-shrink-0">
        AI<span className="text-violet-400">News</span>
      </Link>

      {/* Inline search */}
      <div className="relative flex-1 max-w-[480px] mx-10">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          className="
            w-full pl-10 pr-4 py-2
            bg-white/[0.07] border border-white/[0.15]
            rounded-xl text-sm text-slate-100 placeholder:text-slate-500
            focus:outline-none focus:ring-0 focus:border-cyan-400/50
            transition-colors duration-200
          "
          placeholder="Search articles, topics, papers…"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Bookmarks icon button */}
      <div className="flex items-center gap-3">
        <Link
          to="/bookmarks"
          className="
            relative w-9 h-9 rounded-[9px]
            flex items-center justify-center
            bg-white/[0.05] border border-white/[0.12]
            text-slate-500 text-sm
            hover:text-cyan-400 hover:border-cyan-400/30
            transition-all duration-150
          "
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" />
          </svg>
          {bookmarkCount > 0 && (
            <span className="
              absolute -top-1 -right-1
              min-w-[16px] h-4 px-1
              bg-violet-500 rounded-full
              text-[10px] font-bold text-white
              flex items-center justify-center
            ">
              {bookmarkCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
