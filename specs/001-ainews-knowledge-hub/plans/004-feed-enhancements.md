# Implementation Plan: Feed Enhancements (Sort, Multi-File, Date Format)

**Status**: ✅ Completed (2026-04-02)
**Date**: 2026-04-01
**Branch**: `001-ainews-knowledge-hub`
**Scope**: Three independent enhancements to the news feed — video sorting,
multi-file data loading, and date display format.

---

## Objective

1. **Sort videos to top** — Within each topic column, video items appear before
   articles, papers, and social posts.
2. **Multi-file news data** — Support multiple dated JSON files loaded via a
   manifest, with item deduplication. Enables daily content additions without
   losing historical data.
3. **Show day in dates** — Change "Mar 2026" → "Mar 31, 2026" across feed cards
   and detail pages.

---

## Pre-flight: Files to Read First

1. `.specify/memory/constitution.md` — non-negotiable constraints
2. `docs/ux-design-guide.md` — visual design reference
3. `src/context/NewsContext.tsx` — current data loading (single file)
4. `src/components/feed/NewsFeed.tsx` — topic grouping, no sorting
5. `src/components/feed/NewsCard.tsx` — date formatting (lines 48-51)
6. `src/components/item/ItemDetail.tsx` — date formatting (lines 42-45)
7. `src/types/index.ts` — `NewsData`, `NewsItem`, `ContentType` types

---

## Enhancement C: Show Day in Date Display

### New file: `src/utils/formatDate.ts`

```ts
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
```

### Modify: `src/components/feed/NewsCard.tsx`

- Remove inline `toLocaleDateString` call (lines 48-51)
- Import and use `formatDate(item.publishedAt)`

### Modify: `src/components/item/ItemDetail.tsx`

- Remove inline `toLocaleDateString` call (lines 42-45)
- Import and use `formatDate(item.publishedAt)`

---

## Enhancement A: Sort Videos to Top Within Each Topic

### New file: `src/utils/sortItems.ts`

```ts
import type { NewsItem } from '../types';

export function sortItemsVideosFirst(items: NewsItem[]): NewsItem[] {
  const videos = items.filter((item) => item.type === 'video');
  const rest = items.filter((item) => item.type !== 'video');
  return [...videos, ...rest];
}
```

### Modify: `src/components/feed/NewsFeed.tsx`

Wrap `getItemsForTopic` with sorting:

```ts
import { sortItemsVideosFirst } from '../../utils/sortItems';

const getItemsForTopic = (topic: Topic) =>
  sortItemsVideosFirst(items.filter((item) => item.topics.includes(topic)));
```

Both desktop grid and mobile tab call `getItemsForTopic`, so both get sorted.

---

## Enhancement B: Multi-File News Data with Manifest

### Data file changes

- **Rename** `public/data/news.json` → `public/data/news-03-30-2026.json`
- **Create** `public/data/news-03-31-2026.json` (placeholder copy, operator
  regenerates via Claude Code trigger)
- **Create** `public/data/manifest.json`:
  ```json
  { "files": ["news-03-30-2026.json", "news-03-31-2026.json"] }
  ```

### Modify: `src/types/index.ts`

Add manifest type:

```ts
export interface Manifest {
  files: string[];
}
```

### Modify: `src/context/NewsContext.tsx`

Rewrite `useEffect` to two-phase fetch:

1. Fetch `/data/manifest.json`
2. `Promise.all` to fetch each file listed in manifest
3. Merge items: sort files by `generatedAt` descending, deduplicate by `id`
   (newest file wins)
4. Construct merged `NewsData` with latest metadata

### Downstream impact

None — `NewsContextValue` shape is unchanged. All consumers read `data.items`.

---

## Execution Order

C → A → B (smallest to largest; each independently verifiable)

---

## Constraints

- Modify only the files listed above
- TypeScript strict mode — no `any`
- Tailwind CSS only — no inline styles
- No new npm dependencies
- Do not change content in existing `news.json` data, only rename the file

---

## Verification

1. `npm run build` — zero TypeScript errors
2. `npm run dev` and confirm:
   - Dates show "Mar 7, 2026" format on feed cards and detail page
   - Video cards appear before articles/papers/social within each topic column
   - All items from both news files load correctly
   - No duplicate items in the feed
3. Network tab: `manifest.json` loads first, then both `news-*.json` files
