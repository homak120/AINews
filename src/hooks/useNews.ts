import { useNewsContext } from '../context/NewsContext';
import type { NewsItem, Topic } from '../types';

interface UseNewsReturn {
  items: NewsItem[];
  getById: (id: string) => NewsItem | undefined;
  getByTopic: (topic: Topic) => NewsItem[];
  search: (query: string, topic?: Topic | null) => NewsItem[];
  isLoading: boolean;
  error: string | null;
}

export function useNews(): UseNewsReturn {
  const { data, isLoading, error } = useNewsContext();
  const items = data?.items ?? [];

  const getById = (id: string) => items.find((item) => item.id === id);

  const getByTopic = (topic: Topic) =>
    items.filter((item) => item.topics.includes(topic));

  const search = (query: string, topic?: Topic | null): NewsItem[] => {
    const q = query.trim().toLowerCase();
    let results = topic ? getByTopic(topic) : items;

    if (q) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return results;
  };

  return { items, getById, getByTopic, search, isLoading, error };
}
