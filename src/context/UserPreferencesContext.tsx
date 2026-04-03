import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_PREFERENCES, type KnowledgeCheckResult, type SavedSearch, type UserPreferences } from '../types';

interface UserPreferencesContextValue {
  preferences: UserPreferences;
  updateBookmarks: (bookmarks: string[]) => void;
  updateNotes: (notes: Record<string, string>) => void;
  updateKnowledgeCheckResults: (
    results: Record<string, KnowledgeCheckResult>
  ) => void;
  updateSavedSearches: (savedSearches: SavedSearch[]) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextValue | null>(null);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'ainews:preferences',
    DEFAULT_PREFERENCES
  );

  const updateBookmarks = (bookmarks: string[]) => {
    setPreferences({ ...preferences, bookmarks });
  };

  const updateNotes = (notes: Record<string, string>) => {
    setPreferences({ ...preferences, notes });
  };

  const updateKnowledgeCheckResults = (
    knowledgeCheckResults: Record<string, KnowledgeCheckResult>
  ) => {
    setPreferences({ ...preferences, knowledgeCheckResults });
  };

  const updateSavedSearches = (savedSearches: SavedSearch[]) => {
    setPreferences({ ...preferences, savedSearches });
  };

  return (
    <UserPreferencesContext.Provider
      value={{ preferences, updateBookmarks, updateNotes, updateKnowledgeCheckResults, updateSavedSearches }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences(): UserPreferencesContextValue {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) throw new Error('useUserPreferences must be used inside UserPreferencesProvider');
  return ctx;
}
