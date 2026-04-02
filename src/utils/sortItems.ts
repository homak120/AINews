import type { NewsItem, SortOrder } from '../types';

/**
 * Returns a new array with video items first, preserving original order within
 * each group (videos and non-videos).
 */
export function sortItemsVideosFirst(items: NewsItem[]): NewsItem[] {
  const videos = items.filter((item) => item.type === 'video');
  const rest = items.filter((item) => item.type !== 'video');
  return [...videos, ...rest];
}

/**
 * Sorts items by publishedAt date. Within the same date, videos appear first.
 */
export function sortItemsByDate(items: NewsItem[], order: SortOrder): NewsItem[] {
  return [...items].sort((a, b) => {
    const dateCompare = a.publishedAt.localeCompare(b.publishedAt);
    if (dateCompare !== 0) {
      return order === 'newest' ? -dateCompare : dateCompare;
    }
    // Same date: videos first
    if (a.type === 'video' && b.type !== 'video') return -1;
    if (a.type !== 'video' && b.type === 'video') return 1;
    return 0;
  });
}
