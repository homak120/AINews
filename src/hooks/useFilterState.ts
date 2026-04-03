import { useState } from 'react';
import { DEFAULT_FILTER_STATE, type ContentTypeFilterValue, type DateRange, type FilterState, type Topic } from '../types';

export function useFilterState() {
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER_STATE);

  const setContentType = (contentType: ContentTypeFilterValue) => {
    setFilterState((prev) => ({ ...prev, contentType }));
  };

  const setActiveTopic = (activeTopic: Topic | null) => {
    setFilterState((prev) => ({ ...prev, activeTopic }));
  };

  const setActiveTag = (tag: string | null) => {
    setFilterState((prev) => ({
      ...prev,
      activeTag: prev.activeTag === tag ? null : tag,
    }));
  };

  const setDateRange = (dateRange: DateRange | null) => {
    setFilterState((prev) => ({ ...prev, dateRange }));
  };

  const setTextQuery = (textQuery: string) => {
    setFilterState((prev) => ({ ...prev, textQuery }));
  };

  const resetAll = () => {
    setFilterState(DEFAULT_FILTER_STATE);
  };

  const loadSnapshot = (filters: FilterState) => {
    setFilterState(filters);
  };

  return {
    filterState,
    setContentType,
    setActiveTopic,
    setActiveTag,
    setDateRange,
    setTextQuery,
    resetAll,
    loadSnapshot,
  };
}
