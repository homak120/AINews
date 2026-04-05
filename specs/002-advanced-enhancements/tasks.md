# Tasks: Advanced Enhancements

**Input**: Design documents from `/specs/002-advanced-enhancements/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, research.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add shared types and the centralized filter state hook that all
user stories depend on.

- [x] T001 Add `ContentTypeFilterValue`, `DateRange`, `FilterState`, and `SavedSearch` types to `src/types/index.ts` — see data-model.md for exact field definitions. Also extend `UserPreferences` interface with `savedSearches: SavedSearch[]` and update `DEFAULT_PREFERENCES` constant.
- [x] T002 Create `src/hooks/useFilterState.ts` — custom hook managing all filter criteria (`contentType`, `activeTopic`, `activeTag`, `dateRange`, `textQuery`) as a single state object via `useState`. Expose setters for each field, a `resetAll()` method, and a `loadSnapshot(filters: FilterState)` method. Default state: `contentType: 'all'`, `activeTopic: null`, `activeTag: null`, `dateRange: null`, `textQuery: ''`.

**Checkpoint**: Types compile, `useFilterState` hook is importable. No UI changes yet.

---

## Phase 2: Content Type Filter — US1 (Priority: P1) MVP

**Goal**: Add Video / Article / Paper / Social / All pill buttons to the feed
filter bar so users can filter by content type in one click.

**Independent Test**: Select "Video" → only video items appear in all topic
columns. Select "All" → everything returns. Combines with topic filter.

- [x] T003 [P] [US1] Create `src/components/feed/ContentTypeFilter.tsx` — pill button row rendering All, Video, Article, Paper, Social options. Reuse TopicFilter pill styling: base `rounded-full px-4 py-1.5 text-xs transition-all duration-200 border`, active `bg-white/[0.12] text-white border-white/[0.20] font-semibold`, inactive `bg-white/[0.04] border-white/[0.10] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200`. Props: `value: ContentTypeFilterValue`, `onChange: (value: ContentTypeFilterValue) => void`.
- [x] T004 [P] [US1] Create `src/components/common/FilterEmptyState.tsx` — displays a message describing active filters and a "Clear all" button when zero items match. Props: `message: string`, `onClear: () => void`. Style to match existing `ErrorState` component pattern with glass panel.
- [x] T005 [US1] Integrate `useFilterState` into `src/pages/HomePage.tsx` — replace existing `searchQuery` and `activeTopic` state with the unified `useFilterState` hook. Pass `filterState` setters to Header (search), TopicFilter (topic), and the new ContentTypeFilter. Compute filtered items: start with all items from `useNews()`, then apply contentType filter (if not 'all'), then activeTopic, then textQuery. Pass filtered items to `NewsFeed`.
- [x] T006 [US1] Add `ContentTypeFilter` to `src/components/feed/NewsFeed.tsx` — render in the filter bar row between TopicFilter and sort pills. Accept `contentType` and `onContentTypeChange` as new props. Update `NewsFeedProps` interface accordingly.
- [x] T007 [US1] Show `FilterEmptyState` in `src/components/feed/TopicSection.tsx` when a topic column has zero items after filtering — display "No {type} items in this topic" with the content type name.

**Checkpoint**: Content type filtering works end-to-end. User can click Video → only videos shown. Click All → everything returns. Combines with topic filter and sort order. Empty columns show descriptive message. **MVP deliverable.**

---

## Phase 3: Tag-Based Filtering — US2 (Priority: P2)

**Goal**: Render tags as clickable chips on news cards and item detail pages.
Clicking a tag filters the home feed to items with that tag.

**Independent Test**: Click a tag on any card → feed shows only items with
that tag. Click same tag → filter clears. Click tag on detail page →
navigates to home with tag filter active.

- [x] T008 [P] [US2] Create `src/components/feed/TagChips.tsx` — renders an array of tag strings as small clickable pills. Props: `tags: string[]`, `activeTag: string | null`, `onTagClick: (tag: string) => void`. Styling: base `rounded-full px-2.5 py-0.5 text-[10px] font-mono cursor-pointer transition-all duration-150 border`, default `bg-white/[0.04] border-white/[0.08] text-slate-500 hover:bg-white/[0.08] hover:text-slate-300`, active `bg-cyan-500/10 border-cyan-500/25 text-cyan-400`. Single tag selection — clicking a new tag replaces previous; clicking same tag clears.
- [x] T009 [US2] Add `TagChips` to `src/components/feed/NewsCard.tsx` — render in the footer area before the date. Pass `item.tags`, the current `activeTag`, and an `onTagClick` handler. The `onTagClick` must call `e.preventDefault()` and `e.stopPropagation()` to prevent card Link navigation. Add `activeTag` and `onTagClick` to `NewsCardProps`.
- [x] T010 [US2] Add `TagChips` to `src/components/item/ItemDetail.tsx` — render below the topic badge row. On click, navigate to `/?tag={tagName}` using React Router's `useNavigate`. No `activeTag` highlight needed on detail page (always show default styling).
- [x] T011 [US2] Pass `activeTag` and `onTagClick` through the component chain: `HomePage` → `NewsFeed` → `TopicSection` → `NewsCard`. Update `NewsFeedProps`, `TopicSectionProps`, and `NewsCardProps` interfaces to accept these props.
- [x] T012 [US2] Read `tag` query parameter in `src/pages/HomePage.tsx` using `useSearchParams` from React Router. On mount (and param change), sync the `tag` value to `useFilterState.setActiveTag()`. Clear the URL param after syncing to avoid stale state on subsequent navigation.
- [x] T013 [US2] Apply tag filter in `HomePage` item filtering logic — after contentType and activeTopic filters, add: if `activeTag` is set, keep only items where `item.tags.includes(activeTag)`. Show active tag indicator near filter bar (e.g., a dismissible chip showing "Tag: {name} ×").

**Checkpoint**: Tag filtering works from both cards and detail page. Combines with content type and topic filters. Clicking same tag toggles it off.

---

## Phase 4: Advanced Search — US3 (Priority: P3)

**Goal**: Add an expandable search panel with date range, content type, and
topic selectors. All criteria combine with text search using AND logic.

**Independent Test**: Set date range Apr 1–2, select Video, select AI Research
→ only matching items appear. Click "Reset all" → full feed returns.

- [x] T014 [P] [US3] Create `src/components/search/DateRangePicker.tsx` — two date `<input type="date">` fields (start and end) with validation: end must be >= start. Styled for dark theme: inputs use `bg-white/[0.07] border border-white/[0.15] rounded-lg text-slate-100 text-sm px-3 py-2`. Props: `value: DateRange | null`, `onChange: (range: DateRange | null) => void`. Show inline error text if end < start.
- [x] T015 [P] [US3] Create `src/components/search/AdvancedSearch.tsx` — collapsible panel toggled by a "Filters" button. Contains: DateRangePicker, content type selector (reuse ContentTypeFilter or inline pills), topic selector (reuse TopicFilter pattern). Panel styled as glass container: `bg-white/[0.06] backdrop-blur-xl border border-white/[0.12] rounded-2xl p-4`. Includes a "Reset all" button. Props: `filterState: FilterState`, `onFilterChange: (partial: Partial<FilterState>) => void`, `onResetAll: () => void`.
- [x] T016 [US3] Integrate `AdvancedSearch` into `src/pages/HomePage.tsx` — render below Header, above NewsFeed. Wire all filter controls to `useFilterState`. Add a toggle button ("Filters ▾" / "Filters ▴") to show/hide the panel. Default: collapsed.
- [x] T017 [US3] Apply date range filter in `HomePage` item filtering logic — after tag filter, add: if `dateRange` is set, keep only items where `item.publishedAt >= dateRange.start && item.publishedAt <= dateRange.end` (string comparison works for ISO dates).
- [x] T018 [US3] Show active filter summary bar in `src/pages/HomePage.tsx` — when any filters are active (beyond defaults), render a compact bar showing active criteria (e.g., "Video · AI Research · Apr 1–2 · Tag: LLM") with a "Clear all ×" button that calls `resetAll()`.

**Checkpoint**: Multi-criteria search works. All 5 filter dimensions (text, type, topic, tag, date) combine with AND logic. Reset clears everything.

---

## Phase 5: Saved Searches — US4 (Priority: P4)

**Goal**: Allow users to save named filter combinations to localStorage and
reload them with one click. Maximum 5 saved searches.

**Independent Test**: Apply filters → Save → name it "Research Videos" →
refresh browser → saved search chip appears → click it → filters restored.

- [x] T019 [US4] Create `src/hooks/useSavedSearches.ts` — localStorage CRUD hook following `useBookmarks` pattern. Uses `UserPreferencesContext` to read/write `preferences.savedSearches`. Methods: `save(name: string, filters: FilterState): boolean` (returns false if at limit), `remove(id: string)`, `getAll(): SavedSearch[]`. Enforces max 5 limit. Generates ID as `'ss-' + Date.now()`.
- [x] T020 [US4] Add `updateSavedSearches` method to `src/context/UserPreferencesContext.tsx` — follows existing `updateBookmarks`/`updateNotes` pattern. Accepts `savedSearches: SavedSearch[]` and merges into preferences.
- [x] T021 [P] [US4] Create `src/components/search/SavedSearches.tsx` — renders a row of saved search chips + a "Save" button. Each chip shows the search name and a delete (×) icon. "Save" button only visible when any filter is active (non-default state). Clicking "Save" shows an inline text input for naming. Clicking a chip calls `onLoad(filters)`. When limit reached and user tries to save, show message "Maximum 5 saved searches. Delete one to save a new one." Props: `savedSearches: SavedSearch[]`, `onSave: (name: string) => void`, `onLoad: (filters: FilterState) => void`, `onDelete: (id: string) => void`, `hasActiveFilters: boolean`.
- [x] T022 [US4] Wire `SavedSearches` into `src/pages/HomePage.tsx` — render near the filter/search area (below AdvancedSearch toggle, above NewsFeed). Connect `useSavedSearches` hook: "Save" calls `save(name, currentFilterState)`, chip click calls `useFilterState.loadSnapshot(filters)`, delete calls `remove(id)`. Compute `hasActiveFilters` by comparing current filter state to defaults.

**Checkpoint**: Saved searches persist and reload correctly across browser sessions. Max 5 enforced. Delete works.

---

## Phase 6: Polish & Mobile

**Purpose**: Responsive behavior, cross-feature integration, build verification.

- [x] T023 [P] Test all filter combinations on 375px mobile viewport in `src/components/feed/NewsFeed.tsx` and `src/components/search/AdvancedSearch.tsx` — ensure no horizontal page overflow, no clipped pill buttons. Fix any overflow issues with `overflow-x-auto` or `flex-wrap`.
- [x] T024 [P] Ensure `AdvancedSearch` panel in `src/components/search/AdvancedSearch.tsx` collapses to stacked vertical layout on mobile — date inputs full-width, filter pills wrap. Use `flex-col` at small breakpoints, `sm:flex-row` at larger.
- [x] T025 [P] Ensure tag chips in `src/components/feed/NewsCard.tsx` use horizontal scroll (`overflow-x-auto`) on narrow card widths to prevent line wrapping from bloating card height.
- [x] T026 Verify TypeScript strict build passes: run `npm run build` with zero errors and zero warnings in modified files.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (US1)**: Depends on T001, T002 — BLOCKS remaining user stories
- **Phase 3 (US2)**: Depends on Phase 2 completion (uses `useFilterState` and filter bar integration)
- **Phase 4 (US3)**: Depends on Phase 2 completion (extends `useFilterState` usage)
- **Phase 5 (US4)**: Depends on Phase 2 completion (needs `FilterState` type and `useFilterState.loadSnapshot`)
- **Phase 6 (Polish)**: Depends on all prior phases

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 1 — no dependencies on other stories
- **US2 (P2)**: Can start after US1 is complete (needs filter bar integration in NewsFeed)
- **US3 (P3)**: Can start after US1 is complete (independent of US2)
- **US4 (P4)**: Can start after US1 is complete (independent of US2/US3, needs FilterState)

### Parallel Opportunities

- T003 + T004 can run in parallel (different new files, no shared dependencies)
- T008 can run in parallel with T014 + T015 (different new files in different directories)
- T021 can run in parallel with T019 (different files)
- T023 + T024 + T025 can run in parallel (different files, independent concerns)

### Within Each User Story

- Types/hooks before components
- Components before integration into pages
- Integration before filter logic application
- Story complete before moving to next priority

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: US1 Content Type Filter (T003–T007)
3. **STOP and VALIDATE**: Content type filter works, combines with topic + sort
4. Deploy if ready — this is the MVP

### Incremental Delivery

1. Phase 1 + Phase 2 → **MVP: content type filter** ← Deploy
2. Add Phase 3 (US2) → tag filtering works alongside type filter ← Deploy
3. Add Phase 4 (US3) → advanced search with date range ← Deploy
4. Add Phase 5 (US4) → saved searches ← Deploy
5. Phase 6 → polish and final verification

Each phase adds value without breaking previous phases.
