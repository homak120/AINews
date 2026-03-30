import { useUserPreferences } from '../context/UserPreferencesContext';

interface UseBookmarksReturn {
  bookmarks: string[];
  toggle: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

export function useBookmarks(): UseBookmarksReturn {
  const { preferences, updateBookmarks } = useUserPreferences();

  const toggle = (id: string) => {
    const exists = preferences.bookmarks.includes(id);
    const next = exists
      ? preferences.bookmarks.filter((b) => b !== id)
      : [...preferences.bookmarks, id];
    updateBookmarks(next);
  };

  const isBookmarked = (id: string) => preferences.bookmarks.includes(id);

  return { bookmarks: preferences.bookmarks, toggle, isBookmarked };
}
