import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import axios from 'axios';
import type { Manifest, NewsData, NewsItem } from '../types';

interface NewsContextValue {
  data: NewsData | null;
  isLoading: boolean;
  error: string | null;
}

const NewsContext = createContext<NewsContextValue | null>(null);

/**
 * Merge items from multiple NewsData files, deduplicating by id.
 * When the same id appears in multiple files, the item from the file
 * with the newest generatedAt wins.
 */
function mergeNewsFiles(files: NewsData[]): NewsData {
  // Sort files newest-first so the first occurrence of each id wins
  const sorted = [...files].sort(
    (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );

  const seen = new Set<string>();
  const mergedItems: NewsItem[] = [];

  for (const file of sorted) {
    for (const item of file.items) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        mergedItems.push(item);
      }
    }
  }

  const newest = sorted[0];
  return {
    generatedAt: newest?.generatedAt ?? '',
    weekOf: newest?.weekOf ?? '',
    items: mergedItems,
  };
}

export function NewsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<NewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<Manifest>('/data/manifest.json')
      .then((res) => {
        const filePaths = res.data.files.map((f) => `/data/${f}`);
        return Promise.all(filePaths.map((p) => axios.get<NewsData>(p)));
      })
      .then((responses) => {
        const allFiles = responses.map((r) => r.data);
        setData(mergeNewsFiles(allFiles));
      })
      .catch(() => {
        setError('Failed to load news data. Please check that data/manifest.json and referenced files exist.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <NewsContext.Provider value={{ data, isLoading, error }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNewsContext(): NewsContextValue {
  const ctx = useContext(NewsContext);
  if (!ctx) throw new Error('useNewsContext must be used inside NewsProvider');
  return ctx;
}
