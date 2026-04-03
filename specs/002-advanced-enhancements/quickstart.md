# Quickstart: Advanced Enhancements

**Branch**: `002-advanced-enhancements`

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
git checkout 002-advanced-enhancements
npm install
npm run dev
```

No new dependencies to install. The app runs at `http://localhost:5173`.

## Verify Existing State

Before starting implementation, confirm:

1. **App loads**: Home feed displays news items across 4 topic columns
2. **Topic filter works**: Clicking a topic pill filters to that topic
3. **Sort works**: Newest/Oldest pills change item order
4. **Data exists**: `public/data/manifest.json` lists at least one data file
5. **Tags exist in data**: Check any JSON file for `"tags": [...]` arrays

## Implementation Order

1. **US1 — Content Type Filter** (MVP): Add pills, filter items by type
2. **US2 — Tag Filtering**: Add clickable tag chips, filter by tag
3. **US3 — Advanced Search**: Add date range + multi-criteria panel
4. **US4 — Saved Searches**: Add localStorage persistence for filters

Each phase is independently deployable after US1.

## Validation

After each phase, run:

```bash
npm run build
```

Must complete with zero TypeScript errors. Then manually verify:

- Filter combinations work correctly (AND logic)
- Mobile viewport (375px) has no overflow
- Tag clicks navigate correctly between detail and home pages
- Saved searches persist after browser refresh (US4 only)

## Key Files to Read

| File | Purpose |
|------|---------|
| `src/pages/HomePage.tsx` | Filter state owner |
| `src/components/feed/NewsFeed.tsx` | Filter bar + item rendering |
| `src/components/layout/TopicFilter.tsx` | Pill button styling reference |
| `src/hooks/useBookmarks.ts` | localStorage hook pattern |
| `src/types/index.ts` | Type definitions |
| `docs/ux-design-guide.md` | Design system reference |
