import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import { useFilterState } from '../hooks/useFilterState';
import { useSavedSearches } from '../hooks/useSavedSearches';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { DEFAULT_FILTER_STATE } from '../types';
import { Header } from '../components/layout/Header';
import { NewsFeed } from '../components/feed/NewsFeed';
import { AdvancedSearch } from '../components/search/AdvancedSearch';
import { SavedSearches } from '../components/search/SavedSearches';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import type { NewsItem } from '../types';

export function HomePage() {
  const { items, isLoading, error } = useNews();
  const { preferences } = useUserPreferences();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    filterState,
    setContentType,
    setActiveTopic,
    setActiveTag,
    setDateRange,
    setTextQuery,
    resetAll,
    loadSnapshot,
  } = useFilterState();

  const { savedSearches, save, remove } = useSavedSearches();

  const hasActiveFilters =
    filterState.contentType !== DEFAULT_FILTER_STATE.contentType ||
    filterState.activeTopic !== DEFAULT_FILTER_STATE.activeTopic ||
    filterState.activeTag !== DEFAULT_FILTER_STATE.activeTag ||
    filterState.dateRange !== DEFAULT_FILTER_STATE.dateRange ||
    filterState.textQuery !== DEFAULT_FILTER_STATE.textQuery;

  // Sync ?tag= query param to filter state on mount
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      setActiveTag(tagParam);
      setSearchParams({}, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply all filters (AND logic)
  const filteredItems = items.filter((item: NewsItem) => {
    if (filterState.contentType !== 'all' && item.type !== filterState.contentType) return false;
    if (filterState.activeTopic && !item.topics.includes(filterState.activeTopic)) return false;
    if (filterState.activeTag && !item.tags.includes(filterState.activeTag)) return false;
    if (filterState.dateRange) {
      if (item.publishedAt < filterState.dateRange.start || item.publishedAt > filterState.dateRange.end) return false;
    }
    if (filterState.textQuery) {
      const q = filterState.textQuery.trim().toLowerCase();
      if (q) {
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matches) return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#060a14]">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full
                        bg-[radial-gradient(circle,rgba(167,139,250,0.18)_0%,transparent_70%)]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[700px] h-[700px] rounded-full
                        bg-[radial-gradient(circle,rgba(34,211,238,0.14)_0%,transparent_70%)]" />
        <div className="absolute top-1/2 left-[40%] w-[400px] h-[400px] rounded-full
                        bg-[radial-gradient(circle,rgba(52,211,153,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10">
        <Header
          onSearch={setTextQuery}
          bookmarkCount={preferences.bookmarks.length}
        />

        <main className="max-w-[1280px] mx-auto px-8 md:px-5 py-8">
          {isLoading && <LoadingState />}
          {error && <ErrorState message={error} />}
          {!isLoading && !error && (
            <>
            <AdvancedSearch
              filterState={filterState}
              onContentTypeChange={setContentType}
              onTopicChange={setActiveTopic}
              onDateRangeChange={setDateRange}
              onResetAll={resetAll}
            />
            <SavedSearches
              savedSearches={savedSearches}
              onSave={(name) => save(name, filterState)}
              onLoad={loadSnapshot}
              onDelete={remove}
              hasActiveFilters={hasActiveFilters}
              isAtLimit={savedSearches.length >= 5}
            />
            <NewsFeed
              items={filteredItems}
              activeTopic={filterState.activeTopic}
              onTopicChange={setActiveTopic}
              contentType={filterState.contentType}
              onContentTypeChange={setContentType}
              activeTag={filterState.activeTag}
              onTagClick={setActiveTag}
              filterState={filterState}
              onResetAll={resetAll}
              onLoadSnapshot={loadSnapshot}
              onDateRangeChange={setDateRange}
            />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
