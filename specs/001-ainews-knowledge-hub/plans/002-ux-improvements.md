# Implementation Plan: UX Improvements — Batch 1

**Status**: ✅ Completed
**Date**: 2026-03-31
**Scope**: Post-MVP incremental improvements to existing features. No new pages,
no schema changes, no new dependencies.

---

## Context

All 7 changes in this batch were identified through a code audit comparing the
live implementation against `docs/ux-design-guide.md` and the original spec.
They are targeted, single-file or two-file changes that improve design accuracy,
functional completeness, and UX feedback loops.

The existing `public/data/news.json` baseline was preserved — no data
regeneration was required.

---

## Changes Implemented

### Change 1 — Interactive bookmark button on NewsCard ✅
**File**: `src/components/feed/NewsCard.tsx`

Added an interactive bookmark toggle button to the feed card header (top-right).
Previously, bookmarking was only possible from the item detail view. Button uses
`e.preventDefault()` + `e.stopPropagation()` inside the `<Link>` wrapper.
States: default `text-slate-600`, hover `hover:text-cyan-400`, saved
`text-cyan-400`. Reads bookmark state directly from `useBookmarks()` hook.

---

### Change 2 — Key Concepts chip colors match topic accent ✅
**Files**: `src/components/item/Breakdown.tsx`, `src/components/item/ItemDetail.tsx`

`Breakdown` component previously hardcoded all Key Concepts chips to violet
regardless of topic. Added optional `topicAccent?: string` prop to `Breakdown`.
`ItemDetail` now derives the accent class from `primaryTopic` using the existing
`TOPIC_ACCENT` map and passes it down. Falls back to violet if no topic prop
is provided.

---

### Change 3 — Replaced inline style with Tailwind class on bookmark button ✅
**File**: `src/components/item/ItemDetail.tsx`

Removed `style={{ color: bookmarked ? '#22d3ee' : '#64748b' }}` from the
detail view bookmark button. Replaced with `cn()` conditional Tailwind classes:
`bookmarked ? 'text-cyan-400' : 'text-slate-500 hover:text-cyan-400'`.
Aligns with constitution principle III (Tailwind CSS only, no inline styles
for design values).

---

### Change 4 — Knowledge check completion badge on feed cards ✅
**File**: `src/components/feed/NewsCard.tsx`

Added a `✓ Checked` emerald pill badge in the card footer when
`isCompleted(item.id)` is true AND `item.knowledgeChecks.length > 0`.
Badge style: `bg-emerald-500/10 border border-emerald-500/25 text-emerald-400`.
Surfaces learning progress in the feed without requiring the user to open items.

---

### Change 5 — Related content hover uses topic accent color ✅
**File**: `src/components/item/RelatedContent.tsx`

Related content link rows previously used `hover:border-white/[0.15]` (neutral).
Added `TOPIC_HOVER_BORDER` map per topic and applied it via `cn()`. Aligns with
design guide §5 interaction rule: "Reference card hover → border → accent".

---

### Change 6 — Knowledge check completion shows per-question breakdown ✅
**File**: `src/components/item/KnowledgeCheck.tsx`

Completion summary previously showed only a score (e.g. "2/3 correct"). Now
renders a per-question row for each answered question showing ✓/✗ indicator
and question text (1-line clamp). Correct rows: `bg-emerald-500/[0.06]
border-emerald-500/20`. Incorrect rows: `bg-rose-500/[0.06] border-rose-500/20`.

---

### Change 7 — Mobile horizontal tab row (design guide §4.8) ✅
**File**: `src/components/feed/NewsFeed.tsx`

Mobile view previously stacked all four topic columns vertically. Replaced with
a horizontal scrolling tab bar (one button per topic, accent-colored when
active) showing a single `TopicSection` at a time. Tab state managed with
`useState<Topic>`. `bookmarkedIds` prop removed from `NewsFeed` and
`TopicSection` as bookmark state is now read directly from `useBookmarks()`
inside `NewsCard`.

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/feed/NewsCard.tsx` | Changes 1, 4 |
| `src/components/feed/NewsFeed.tsx` | Change 7 |
| `src/components/feed/TopicSection.tsx` | Change 7 (removed `bookmarkedIds` prop) |
| `src/components/item/Breakdown.tsx` | Change 2 |
| `src/components/item/ItemDetail.tsx` | Changes 2, 3 |
| `src/components/item/KnowledgeCheck.tsx` | Change 6 |
| `src/components/item/RelatedContent.tsx` | Change 5 |
| `src/pages/HomePage.tsx` | Change 7 (removed `bookmarkedIds` pass-through) |
