import type { NewsItem } from '../types';

/**
 * Returns a new array with video items first, preserving original order within
 * each group (videos and non-videos).
 */
export function sortItemsVideosFirst(items: NewsItem[]): NewsItem[] {
  const videos = items.filter((item) => item.type === 'video');
  const rest = items.filter((item) => item.type !== 'video');
  return [...videos, ...rest];
}
