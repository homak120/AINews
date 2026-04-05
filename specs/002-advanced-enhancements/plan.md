# Implementation Plan: Advanced Enhancements

**Branch**: `002-advanced-enhancements` | **Date**: 2026-04-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-advanced-enhancements/spec.md`

## Summary

Add layered filtering to the AINews feed: content type pills (US1), clickable
tag chips (US2), advanced multi-criteria search with date range (US3), and
saved search persistence (US4). All filtering is client-side over pre-loaded
JSON data. No new dependencies, no schema changes, no external API calls.

## Technical Context

**Language/Version**: TypeScript 5+ (strict mode)
**Primary Dependencies**: React 18, React Router v6, Tailwind CSS, Axios (local JSON only)
**Storage**: localStorage via existing `useLocalStorage` hook + `UserPreferencesContext`
**Testing**: Manual verification + `npm run build` (TypeScript strict compile)
**Target Platform**: Web (Vercel deployment), responsive to 375px
**Project Type**: Single-page application (React SPA)
**Performance Goals**: Filter application < 200ms, no layout shift on filter toggle
**Constraints**: No new npm dependencies, no external API calls, Tailwind-only styling
**Scale/Scope**: ~50–100 news items, single user, 4 JSON data files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Evidence |
|---|-----------|--------|----------|
| I | React SPA + TypeScript | PASS | All new code = TypeScript strict. All UI = React functional components + hooks. No `any` types. |
| II | React Router for Navigation | PASS | Tag filter from detail page uses React Router `useNavigate` + query params. No new routes added. |
| III | Tailwind CSS Only | PASS | All styling via utility classes. Filter pills reuse existing `TopicFilter` class patterns. No custom CSS. |
| IV | Static-Data-First | PASS | All filtering is client-side over already-loaded JSON. No new API calls. No schema changes. |
| V | Lightweight State Only | PASS | Filter state via `useState` in `HomePage`. Saved searches via `localStorage` + Context, matching existing `useBookmarks` pattern. No external state libs. |
| VI | YAGNI / Phase-Aware | PASS | Each feature directly addresses a user-selected need. No speculative abstractions. Filter state hook is shared across US1–US4 to avoid duplication, not premature abstraction. |

**Post-design re-check**: All gates still pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-advanced-enhancements/
├── spec.md              # Feature specification (with clarifications)
├── plan.md              # This file
├── research.md          # Phase 0 output — tech decisions
├── data-model.md        # Phase 1 output — filter state & saved search models
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (new + modified files)

```text
src/
├── types/
│   └── index.ts                   # MODIFY — add FilterState, SavedSearch types
├── hooks/
│   ├── useFilterState.ts          # NEW — centralized filter state management
│   └── useSavedSearches.ts        # NEW — localStorage CRUD for saved searches
├── components/
│   ├── feed/
│   │   ├── ContentTypeFilter.tsx  # NEW — content type pill buttons
│   │   ├── TagChips.tsx           # NEW — clickable tag chips
│   │   ├── NewsFeed.tsx           # MODIFY — integrate content type + tag filters
│   │   └── NewsCard.tsx           # MODIFY — render tag chips in footer
│   ├── search/
│   │   ├── AdvancedSearch.tsx     # NEW — expandable multi-criteria panel
│   │   ├── DateRangePicker.tsx    # NEW — date range inputs
│   │   └── SavedSearches.tsx      # NEW — saved search chip row + save button
│   ├── item/
│   │   └── ItemDetail.tsx         # MODIFY — render tag chips
│   └── common/
│       └── FilterEmptyState.tsx   # NEW — filter-aware empty state message
├── pages/
│   └── HomePage.tsx               # MODIFY — wire useFilterState + AdvancedSearch
└── context/
    └── UserPreferencesContext.tsx  # MODIFY — add savedSearches to preferences
```

**Structure Decision**: Follows existing project layout. New filter components
go in `feed/` (content type, tags) and `search/` (new subdirectory for
advanced search panel). New hooks follow the existing `useBookmarks`/`useNotes`
pattern for localStorage persistence.

## Architecture: Filter State Flow

```text
HomePage (owns useFilterState)
│
├── Header
│   └── search bar → updates textQuery
│
├── TopicFilter (existing) → updates activeTopic
│
├── ContentTypeFilter (NEW) → updates contentType
│
├── AdvancedSearch (NEW, collapsible)
│   ├── DateRangePicker → updates dateRange
│   ├── Content type selector (mirrors ContentTypeFilter)
│   └── Topic selector (mirrors TopicFilter)
│
├── SavedSearches (NEW)
│   ├── "Save" button → captures FilterState snapshot
│   └── Saved search chips → loads FilterState snapshot
│
└── NewsFeed (receives filtered items)
    ├── TopicSection × N
    │   └── NewsCard × N
    │       └── TagChips (NEW) → updates activeTag
    └── FilterEmptyState (when zero results)
```

**Filter application order** (in `useFilterState` or `HomePage`):

1. Start with all items from `useNews()`
2. Filter by `contentType` (if not 'all')
3. Filter by `activeTopic` (if set)
4. Filter by `activeTag` (if set) — single tag, AND logic
5. Filter by `dateRange` (if set) — inclusive on both ends
6. Filter by `textQuery` (if non-empty) — matches title, summary, tags

All filters use AND logic. Result is passed to `NewsFeed`.

## Design Patterns

### Pill Button Styling (reuse existing TopicFilter classes)

```text
Active:   bg-white/[0.12] text-white border-white/[0.20] font-semibold
Inactive: bg-white/[0.04] border-white/[0.10] text-slate-400
          hover:bg-white/[0.08] hover:text-slate-200
Base:     rounded-full px-4 py-1.5 text-xs transition-all duration-200 border
```

Content type pills use a neutral accent (white) rather than topic-specific
colors since they are cross-topic.

### Tag Chip Styling

```text
Base:     rounded-full px-2.5 py-0.5 text-[10px] font-mono
Default:  bg-white/[0.04] border border-white/[0.08] text-slate-500
Hover:    bg-white/[0.08] text-slate-300
Active:   bg-cyan-500/10 border-cyan-500/25 text-cyan-400
```

Small and unobtrusive on cards; visually distinct when active filter.

### localStorage Schema Extension

Current `ainews:preferences` key stores:
```json
{
  "bookmarks": ["id1", "id2"],
  "notes": { "id1": "my note" },
  "knowledgeCheckResults": { "id1": { "completedAt": "...", "answers": [0, 1] } }
}
```

Extended with:
```json
{
  "bookmarks": [...],
  "notes": {...},
  "knowledgeCheckResults": {...},
  "savedSearches": [
    {
      "id": "ss-1712188800000",
      "name": "Research Videos",
      "filters": {
        "contentType": "video",
        "activeTopic": "ai-research",
        "activeTag": null,
        "dateRange": null,
        "textQuery": ""
      }
    }
  ]
}
```

Maximum 5 saved searches enforced in `useSavedSearches` hook.

## Implementation Phases

### Phase 1: Content Type Filter (US1 — P1, MVP)

1. Add `ContentTypeFilterValue` type to `types/index.ts`
2. Create `useFilterState` hook — manages `contentType`, `activeTag`,
   `dateRange`, `textQuery`, `activeTopic` in one state object
3. Create `ContentTypeFilter.tsx` — pill row reusing TopicFilter styling
4. Integrate into `NewsFeed.tsx` filter bar — add pills next to sort controls
5. Apply content type filter in item filtering logic
6. Create `FilterEmptyState.tsx` for zero-result scenarios

### Phase 2: Tag-Based Filtering (US2 — P2)

1. Create `TagChips.tsx` — renders tags as small clickable pills
2. Add to `NewsCard.tsx` footer (before date)
3. Add to `ItemDetail.tsx` (below topic badge)
4. Wire tag clicks on detail page to navigate home with `?tag=` query param
5. Read `tag` query param in `HomePage` and sync to filter state
6. Add "Clear tag" indicator when tag filter is active

### Phase 3: Advanced Search (US3 — P3)

1. Create `DateRangePicker.tsx` — two date inputs with validation
2. Create `AdvancedSearch.tsx` — collapsible panel with all filter controls
3. Extend `useFilterState` with `dateRange` and `resetAll()`
4. Wire into `HomePage` below search bar
5. Apply date range filter in item filtering logic
6. Show active filter summary with "Clear all" button

### Phase 4: Saved Searches (US4 — P4)

1. Add `SavedSearch` type to `types/index.ts`
2. Extend `UserPreferences` with `savedSearches` field
3. Create `useSavedSearches` hook — CRUD with 5-item limit
4. Create `SavedSearches.tsx` — chip row + save button
5. Wire into `HomePage` search area
6. Add `loadSnapshot()` to `useFilterState`

### Phase 5: Polish & Mobile

1. Test all filter combinations on 375px viewport
2. Collapsible advanced search on mobile
3. Tag chips horizontal scroll on narrow cards
4. Verify `npm run build` passes with zero errors

## Complexity Tracking

No constitution violations. All features use existing patterns at the same
complexity level as Phase 1.
