# Implementation Plan: Video Thumbnail Preview on Feed Cards

**Status**: ✅ Completed (commit bda09b0, 2026-04-01)
**Date**: 2026-03-31
**Scope**: Single-file change to `NewsCard`. No schema changes. No new
dependencies. Non-video cards are completely unaffected.

---

## Objective

Make video items visually distinct in the home feed by displaying a static
YouTube thumbnail image inside the card. The thumbnail is a plain `<img>` tag
using YouTube's public thumbnail URL — no API key, no iframe, no playback.
Clicking the card still navigates to the item detail page as normal.

---

## Pre-flight: Files to Read First

Before writing any code, read these files in order:

1. `.specify/memory/constitution.md` — non-negotiable constraints
2. `docs/ux-design-guide.md` — §1.1 background colors, §4.2 glass card spec,
   §5 interaction rules
3. `src/components/feed/NewsCard.tsx` — the only file you will modify
4. `src/types/index.ts` — confirm `youtubeId?: string` is optional on `NewsItem`

---

## Current State of NewsCard

The card currently renders in this order:

```
<Link>
  <article>              glass card wrapper
    <header>             type badge (left) + bookmark button (right)
    <h2>                 title (line-clamp-2)
    <p>                  summary (line-clamp-3)
    <footer>             source domain + ✓ Checked badge + date
```

---

## Change: Add YouTube Thumbnail Block

### Render condition

Only render the thumbnail block when BOTH are true:
- `item.type === 'video'`
- `item.youtubeId` is a non-empty string (`!!item.youtubeId`)

### Position in card

Insert the thumbnail block **between** `<header>` and `<h2>`. The card
structure for video items after the change:

```
<Link>
  <article>
    <header>             type badge + bookmark button  (unchanged)
    [thumbnail block]    ← INSERT HERE (video only)
    <h2>                 title                         (unchanged)
    <p>                  summary                       (unchanged)
    <footer>             source + checked badge + date (unchanged)
```

### Thumbnail block structure

The thumbnail block is a single `<div>` with three children:

```tsx
{item.type === 'video' && !!item.youtubeId && (
  <div className="relative overflow-hidden rounded-xl mt-3 mb-4">

    {/* 1. Thumbnail image */}
    <img
      src={`https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src =
          `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
      }}
      alt={item.title}
      className="w-full object-cover rounded-xl aspect-video"
    />

    {/* 2. Bottom gradient fade — softens image-to-card edge */}
    <div className="
      absolute inset-x-0 bottom-0 h-8
      bg-gradient-to-t from-[#060a14]/60 to-transparent
      pointer-events-none rounded-b-xl
    " />

    {/* 3. Centered play button overlay */}
    <div className="
      absolute inset-0
      flex items-center justify-center
      pointer-events-none
    ">
      <div className="
        w-10 h-10 rounded-full
        bg-black/50 backdrop-blur-sm
        flex items-center justify-center
      ">
        <svg
          className="w-4 h-4 text-white ml-0.5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>

  </div>
)}
```

### Thumbnail image strategy

- **Primary**: `maxresdefault.jpg` — HD (1280×720), available for most videos
- **Fallback**: `hqdefault.jpg` — always available (480×360), triggered via
  `onError` when `maxresdefault` is missing or returns a blank placeholder
- No additional error handling needed beyond this two-level fallback

---

## Constraints

- Modify `src/components/feed/NewsCard.tsx` **only**
- Do not modify `public/data/news.json` or any data files
- Do not add new npm packages — this is a plain `<img>` tag, no library needed
- All styling must use Tailwind utility classes only — no inline `style` props
- No new props added to `NewsCard` — `item.youtubeId` is already available
  on the `NewsItem` type
- Article, paper, and social cards must look and behave exactly as before

---

## Verification

Run `npm run build` and confirm:

1. TypeScript compiles with zero errors
2. No new ESLint warnings related to the changed file
3. Run `npm run dev` and open the home feed
4. Confirm video cards show the thumbnail with play button overlay
5. Confirm article/paper/social cards are visually unchanged
6. Click a video card — confirm it navigates to the item detail page
   (thumbnail is non-interactive, only the card `<Link>` fires)
7. Confirm the bookmark button in the card header still works correctly
   on video cards (the thumbnail block must not interfere with it)
