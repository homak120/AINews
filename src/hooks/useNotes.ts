import { useRef } from 'react';
import { useUserPreferences } from '../context/UserPreferencesContext';

interface UseNotesReturn {
  getNote: (id: string) => string;
  setNote: (id: string, text: string) => void;
}

export function useNotes(): UseNotesReturn {
  const { preferences, updateNotes } = useUserPreferences();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getNote = (id: string) => preferences.notes[id] ?? '';

  const setNote = (id: string, text: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateNotes({ ...preferences.notes, [id]: text });
    }, 500);
  };

  return { getNote, setNote };
}
