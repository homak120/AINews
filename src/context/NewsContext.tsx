import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import axios from 'axios';
import type { NewsData } from '../types';

interface NewsContextValue {
  data: NewsData | null;
  isLoading: boolean;
  error: string | null;
}

const NewsContext = createContext<NewsContextValue | null>(null);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<NewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<NewsData>('/data/news.json')
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        setError('Failed to load news data. Please check that data/news.json exists.');
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
