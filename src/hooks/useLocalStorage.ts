import { useState } from 'react';

type UseLocalStorageReturn<T> = [T, (value: T) => void, () => void];

export function useLocalStorage<T>(key: string, defaultValue: T): UseLocalStorageReturn<T> {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail on quota exceeded or private browsing restrictions
    }
  };

  const remove = () => {
    try {
      setStoredValue(defaultValue);
      window.localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  };

  return [storedValue, setValue, remove];
}
