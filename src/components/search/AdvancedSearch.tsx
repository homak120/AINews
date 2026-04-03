import { useState } from 'react';
import { cn } from '../../utils/cn';
import { DateRangePicker } from './DateRangePicker';
import { ContentTypeFilter } from '../feed/ContentTypeFilter';
import { DEFAULT_FILTER_STATE, TOPIC_DISPLAY_NAMES, type ContentTypeFilterValue, type DateRange, type FilterState, type Topic } from '../../types';

const ALL_TOPICS = Object.keys(TOPIC_DISPLAY_NAMES) as Topic[];

interface AdvancedSearchProps {
  filterState: FilterState;
  onContentTypeChange: (value: ContentTypeFilterValue) => void;
  onTopicChange: (topic: Topic | null) => void;
  onDateRangeChange: (range: DateRange | null) => void;
  onResetAll: () => void;
}

export function AdvancedSearch({
  filterState,
  onContentTypeChange,
  onTopicChange,
  onDateRangeChange,
  onResetAll,
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    filterState.contentType !== DEFAULT_FILTER_STATE.contentType ||
    filterState.activeTopic !== DEFAULT_FILTER_STATE.activeTopic ||
    filterState.activeTag !== DEFAULT_FILTER_STATE.activeTag ||
    filterState.dateRange !== DEFAULT_FILTER_STATE.dateRange ||
    filterState.textQuery !== DEFAULT_FILTER_STATE.textQuery;

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-all duration-150',
          isOpen || hasActiveFilters
            ? 'bg-white/[0.08] text-slate-200 border-white/[0.15]'
            : 'bg-white/[0.04] text-slate-500 border-white/[0.10] hover:text-slate-300'
        )}
      >
        Filters {isOpen ? '▴' : '▾'}
        {hasActiveFilters && !isOpen && (
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        )}
      </button>

      {isOpen && (
        <div className="mt-3 bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] rounded-2xl p-4 flex flex-col gap-4">
          {/* Content type */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
              Content Type
            </label>
            <ContentTypeFilter value={filterState.contentType} onChange={onContentTypeChange} />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
              Topic
            </label>
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => onTopicChange(null)}
                className={cn(
                  'flex-shrink-0 rounded-full px-3 py-1 text-xs transition-all duration-200 border',
                  filterState.activeTopic === null
                    ? 'bg-white/[0.12] text-white border-white/[0.20] font-semibold'
                    : 'bg-white/[0.04] border-white/[0.10] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200'
                )}
              >
                All
              </button>
              {ALL_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => onTopicChange(topic)}
                  className={cn(
                    'flex-shrink-0 rounded-full px-3 py-1 text-xs transition-all duration-200 border',
                    filterState.activeTopic === topic
                      ? 'bg-white/[0.12] text-white border-white/[0.20] font-semibold'
                      : 'bg-white/[0.04] border-white/[0.10] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200'
                  )}
                >
                  {TOPIC_DISPLAY_NAMES[topic].split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
              Date Range
            </label>
            <DateRangePicker value={filterState.dateRange} onChange={onDateRangeChange} />
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={onResetAll}
                className="text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
