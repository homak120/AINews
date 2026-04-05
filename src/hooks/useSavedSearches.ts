import { useUserPreferences } from '../context/UserPreferencesContext';
import type { FilterState, SavedSearch } from '../types';

const MAX_SAVED_SEARCHES = 5;

export function useSavedSearches() {
  const { preferences, updateSavedSearches } = useUserPreferences();
  const savedSearches = preferences.savedSearches ?? [];

  const save = (name: string, filters: FilterState): boolean => {
    if (savedSearches.length >= MAX_SAVED_SEARCHES) return false;
    const newSearch: SavedSearch = {
      id: `ss-${Date.now()}`,
      name,
      filters,
    };
    updateSavedSearches([...savedSearches, newSearch]);
    return true;
  };

  const remove = (id: string) => {
    updateSavedSearches(savedSearches.filter((s) => s.id !== id));
  };

  const getAll = (): SavedSearch[] => savedSearches;

  return { savedSearches, save, remove, getAll };
}
