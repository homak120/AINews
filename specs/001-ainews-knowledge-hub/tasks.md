# Tasks: AINews Knowledge Hub

**Input**: Design documents from `specs/001-ainews-knowledge-hub/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | data-model.md ✅ | contracts/ ✅ | research.md ✅ | docs/ux-design-guide.md ✅

> **UI Implementation Rule**: Before implementing any component with visual output,
> read `docs/ux-design-guide.md`. All class strings, color tokens, spacing values,
> and component structures are specified there. Do not invent styles.

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks grouped by user story for independent implementation and
testing. Each story phase can be started, completed, and validated on its own.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task belongs to (US1–US5)

---

## Phase 1: Setup

**Purpose**: Scaffold project, install dependencies, configure tooling.

- [x] T001 Scaffold Vite + React + TypeScript project: `npm create vite@latest . -- --template react-ts` at repo root
- [x] T002 [P] Install and configure Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`; update `tailwind.config.js` content paths and `src/index.css` with Tailwind directives
- [x] T002a [P] Extend `tailwind.config.js` with AINews design tokens from `docs/ux-design-guide.md §6`: add `colors.glass`, `colors.accent`, `colors.surface`, `backdropBlur.glass`, `boxShadow.glass`, `boxShadow.glow`, and the `shake` keyframe + animation (depends on T002)
- [x] T003 [P] Install app dependencies: `npm install react-router-dom axios react-lite-youtube-embed clsx tailwind-merge`
- [x] ~~T004~~ *(removed — seed script replaced by Claude Code scheduled trigger)*
- [x] T005 [P] Set TypeScript strict mode: ensure `tsconfig.json` has `"strict": true`, `"noUncheckedIndexedAccess": true`
- [x] T006 Create `data/news.json` with 4 mock items (one per topic: `ai-engineering`, `ai-research`, `ai-career`, `ai-industry`; valid schema from `contracts/news-schema.md`) to unblock all UI development before the Claude Code trigger is configured

---

## Phase 2: Foundational

**Purpose**: Shared types, hooks, contexts, and routing that ALL user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T007 Define all TypeScript types in `src/types/index.ts`: `ContentType`, `Topic`, `KnowledgeCheck`, `NewsItem`, `NewsData`, `KnowledgeCheckResult`, `UserPreferences` — exact interfaces from `data-model.md`
- [x] T008 [P] Create `useLocalStorage<T>` base hook in `src/hooks/useLocalStorage.ts`: typed wrapper returning `[value, setValue, remove]`; handles JSON serialization, try-catch, and missing-key default
- [x] T009 Create `NewsContext` in `src/context/NewsContext.tsx`: loads `data/news.json` via Axios on mount; provides `{ data, isLoading, error }`; shows `ErrorState` if file missing or malformed
- [x] T010 Create `UserPreferencesContext` in `src/context/UserPreferencesContext.tsx`: reads/writes `ainews:preferences` localStorage key; provides `{ preferences, updateBookmarks, updateNotes, updateKnowledgeCheckResults }`
- [x] T011 [P] Create `useNews()` hook in `src/hooks/useNews.ts`: consumes `NewsContext`; exposes `{ items, getById, getByTopic, search, isLoading, error }`; `getByTopic(topic)` filters using `item.topics.includes(topic)`; `search(query, topic?)` filters across `title`, `summary`, and `tags` fields (case-insensitive) and optionally within a topic — composing both constraints
- [x] T012 Create centralized route definitions and wrap app with providers in `src/main.tsx`: `BrowserRouter`, `NewsContext.Provider`, `UserPreferencesContext.Provider`; routes: `/` → `HomePage`, `/item/:id` → `ItemDetailPage`, `/bookmarks` → `BookmarksPage`
- [x] T013 [P] Create `Header` component in `src/components/layout/Header.tsx`: app name/logo on left; functional inline search input (calls `onSearch(query)` prop on every keystroke); bookmarks icon button linking to `/bookmarks`; implement per `docs/ux-design-guide.md §4.6` (sticky z-20, glass nav bar)
- [x] T014 [P] Create `ErrorState` component in `src/components/common/ErrorState.tsx`: accepts `message` prop; used for missing/malformed `news.json` and unknown item IDs
- [x] T015 [P] Create `EmptyState` component in `src/components/common/EmptyState.tsx`: accepts `message` prop; used for empty topic filter results and empty bookmarks list
- [x] T015a [P] Create `LoadingState` component in `src/components/common/LoadingState.tsx`: accepts optional `message` prop (default: "Loading…"); renders a centered spinner or skeleton placeholder; used in `HomePage` while `NewsContext` `isLoading === true`
- [x] T016 [P] Create `cn()` utility in `src/utils/cn.ts`: `import { type ClassValue, clsx } from 'clsx'; import { twMerge } from 'tailwind-merge'; export const cn = (...args: ClassValue[]) => twMerge(clsx(...args))`

**Checkpoint**: Providers mounted, routes registered, base hooks + shared components ready. User story work can begin.

---

## Phase 3: User Story 1 — Browse Curated AI News Feed (Priority: P1) 🎯 MVP

**Goal**: User opens the app, sees all 4 topic sections with news cards, can filter by topic, and clicks into a full item detail with embedded video and educational breakdown.

**Independent Test**: Start the dev server with mock `data/news.json`. Verify all 4 topic sections load on home page, topic filter hides/shows correctly, clicking a card opens the item detail with video player and breakdown visible.

### Implementation for User Story 1

- [x] T017 [P] [US1] Create `TopicFilter` component in `src/components/layout/TopicFilter.tsx`: renders 5 pill buttons ("All" + one per topic); highlights active selection; calls `onSelect(topic | null)` callback; uses topic display names from `data-model.md`; implement chip styles per `docs/ux-design-guide.md §4.3`
- [x] T018 [P] [US1] Create `NewsCard` component in `src/components/feed/NewsCard.tsx`: displays title, content type badge (video/article/paper/social), publication date, and first sentence of summary as teaser; entire card is a `<Link>` to `/item/:id`; implement full card anatomy per `docs/ux-design-guide.md §4.2` (glass base, shimmer line, topic tag, hover lift, bookmarked border state)
- [x] T019 [US1] Create `TopicSection` component in `src/components/feed/TopicSection.tsx`: renders topic display name as section header + list of `NewsCard` components for that topic; shows `EmptyState` if no items; NOTE: `getByTopic(topic)` MUST return items where `item.topics` array **includes** the topic value (not strict equality) to support multi-topic items appearing in multiple sections; implement column header per `docs/ux-design-guide.md §4.4` (sticky top-[56px], accent per topic) (depends on T017, T018)
- [x] T020 [US1] Create `NewsFeed` component in `src/components/feed/NewsFeed.tsx`: renders `TopicFilter` + all 4 `TopicSection` components when no filter active; renders single `TopicSection` when filter selected; multi-topic items will appear in each section whose topic is included in `item.topics`; implement 4-column grid layout per `docs/ux-design-guide.md §3.1` including mobile tab row at ≤768px (§4.8) (depends on T017, T019)
- [x] T021 [P] [US1] Create `VideoPlayer` component in `src/components/item/VideoPlayer.tsx`: wraps `react-lite-youtube-embed`; accepts `youtubeId` prop; shows fallback `<a href={sourceUrl}>Watch on YouTube</a>` if video unavailable
- [x] T022 [P] [US1] Create `Breakdown` component in `src/components/item/Breakdown.tsx`: renders `summary` paragraph, `keyConcepts` as a bulleted list, and `whyItMatters` highlighted section; use typography tokens from `docs/ux-design-guide.md §2.2`
- [x] T023 [US1] Create `ItemDetail` component in `src/components/item/ItemDetail.tsx`: uses `grid-cols-[1fr_380px]` two-panel layout when `item.knowledgeChecks.length > 0` (article left, quiz sidebar right); collapses to `grid-cols-1` single column when no knowledge checks; source metadata shows type, `publishedAt`, `sourceUrl` — omit "Read time" (not in schema); implement per `docs/ux-design-guide.md §4.7`; accepts `item: NewsItem` prop (depends on T021, T022)
- [x] T024 [US1] Create `HomePage` in `src/pages/HomePage.tsx`: manages `searchQuery` and `activeTopic` state via `useState`; passes `onSearch` to `Header` and `activeTopic` to `NewsFeed`; passes composed `search(searchQuery, activeTopic)` results to `NewsFeed`; renders `LoadingState` while `isLoading === true`; renders `ErrorState` if error (depends on T011, T013, T015a, T020)
- [x] T025 [US1] Create `ItemDetailPage` in `src/pages/ItemDetailPage.tsx`: reads `:id` from URL params; calls `getById(id)`; renders `ItemDetail` or `ErrorState` if item not found (depends on T011, T023)

**Checkpoint**: User Story 1 fully functional — app loads, feed displays, filtering works, item detail shows with video and breakdown.

---

## Phase 4: User Story 2 — Bookmarks and Personal Notes (Priority: P2)

**Goal**: User bookmarks any item, adds a personal note, closes the browser, and returns to find both intact.

**Independent Test**: Bookmark an item in `ItemDetail`, add a note, close and reopen the browser. Verify the bookmark icon is filled, the note text is still present, and the item appears in `/bookmarks`.

### Implementation for User Story 2

- [x] T026 [US2] Create `useBookmarks()` hook in `src/hooks/useBookmarks.ts`: consumes `UserPreferencesContext`; exposes `{ bookmarks, toggle(id), isBookmarked(id) }`
- [x] T027 [US2] Create `useNotes()` hook in `src/hooks/useNotes.ts`: consumes `UserPreferencesContext`; exposes `{ getNote(id), setNote(id, text) }`; debounce writes by 500ms
- [x] T028 [US2] Add bookmark toggle button to `src/components/item/ItemDetail.tsx`: imports `useBookmarks()`; renders filled/outline bookmark icon; calls `toggle(item.id)` on click (depends on T026)
- [x] T029 [US2] Add notes textarea to `src/components/item/ItemDetail.tsx`: imports `useNotes()`; pre-fills with existing note; saves on change via `setNote` (depends on T027)
- [x] T030 [P] [US2] Add bookmark indicator dot to `src/components/feed/NewsCard.tsx`: imports `useBookmarks()`; shows a small visual indicator when `isBookmarked(item.id)` is true (depends on T026)
- [x] T031 [P] [US2] Create `BookmarkCard` component in `src/components/bookmarks/BookmarkCard.tsx`: shows item title, type badge, note preview (first 80 chars); entire card links to `/item/:id`
- [x] T032 [US2] Create `BookmarksList` component in `src/components/bookmarks/BookmarksList.tsx`: maps `bookmarks` array to `BookmarkCard` components; resolves each ID via `getById()`; shows `EmptyState` when list is empty (depends on T011, T031)
- [x] T033 [US2] Create `BookmarksPage` in `src/pages/BookmarksPage.tsx`: renders `Header` + `BookmarksList` (depends on T013, T032)

**Checkpoint**: User Story 2 fully functional — bookmarks toggle and persist, notes auto-save and persist, bookmarks page lists saved items.

---

## Phase 5: User Story 3 — Knowledge Checks (Priority: P3)

**Goal**: After reading an item with knowledge check questions, user answers them and gets immediate feedback with explanations. Completion state persists across sessions.

**Independent Test**: Open an item detail for a mock item with `knowledgeChecks` populated. Answer a question — verify correct/incorrect feedback and explanation appear. Reload the page — verify the check shows as completed.

### Implementation for User Story 3

- [x] T034 [US3] Create `useKnowledgeChecks()` hook in `src/hooks/useKnowledgeChecks.ts`: consumes `UserPreferencesContext`; exposes `{ getResult(id), saveResult(id, answers), isCompleted(id) }`
- [x] T035 [US3] Create `KnowledgeCheck` component in `src/components/item/KnowledgeCheck.tsx`: renders 2-3 multiple-choice questions; handles answer selection; shows ✅/❌ feedback and explanation immediately after selection; shows completion summary if `isCompleted`; calls `saveResult` on completion; implement option button styles and correct/wrong states per `docs/ux-design-guide.md §4.5` and §4.7 (depends on T034)
- [x] T036 [US3] Integrate `KnowledgeCheck` into `src/components/item/ItemDetail.tsx`: render `<KnowledgeCheck item={item} />` only when `item.knowledgeChecks.length > 0` (depends on T035)

**Checkpoint**: User Story 3 fully functional — knowledge checks render, answer feedback works, completion persists across sessions.

---

## Phase 6: User Story 4 — Related Content (Priority: P4)

**Goal**: After reading an item, the user sees 2-4 related items at the bottom and can navigate to any of them.

**Independent Test**: Open an item detail for a mock item with `relatedIds` populated. Verify related items appear at the bottom. Click one — verify navigation to its detail view.

### Implementation for User Story 4

- [x] T037 [US4] Create `RelatedContent` component in `src/components/item/RelatedContent.tsx`: accepts `relatedIds: string[]`; resolves each to a `NewsItem` via `getById()`; renders compact cards (title + type badge) as `<Link>` to `/item/:id`; silently skips IDs that don't resolve (depends on T011)
- [x] T038 [US4] Integrate `RelatedContent` into `src/components/item/ItemDetail.tsx`: render `<RelatedContent relatedIds={item.relatedIds} />` only when `item.relatedIds.length > 0` (depends on T037)

**Checkpoint**: User Story 4 fully functional — related content section renders and navigation works.

---

## Phase 7: User Story 5 — Weekly Content Generation (Priority: P5)

**Goal**: A Claude Code scheduled trigger (weekly cron job) generates a valid
`public/data/news.json` covering the past 7 days across all 4 topic areas,
with AI-generated summaries, key concepts, why-it-matters, knowledge checks,
and related item links. No API key required — runs under Claude Pro plan.

**Independent Test**: Run the Claude Code trigger (or ask Claude Code manually).
Inspect `public/data/news.json` — verify it contains items per topic, all
required fields are populated, `relatedIds` reference valid IDs, and
`knowledgeChecks` have valid `correctIndex` values.

### Implementation for User Story 5

- [x] ~~T039~~ *(removed — replaced by Claude Code trigger)*
- [x] ~~T040~~ *(removed — no npm seed script needed)*
- [ ] T041 [US5] Set up Claude Code scheduled trigger for weekly content generation using the prompt template in `contracts/content-generation-prompt.md`; run it to produce the first real `public/data/news.json`; review output; commit the file

**Checkpoint**: Claude Code trigger produces valid `public/data/news.json` that the app loads correctly.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final touches that span multiple user stories.

- [x] T042 Add bookmark count badge to `Header` Bookmarks nav link in `src/components/layout/Header.tsx`: shows number of bookmarked items when > 0
- [ ] T043 Verify all deep-links work: `/`, `/item/:id` with valid ID, `/item/:id` with unknown ID (ErrorState), `/bookmarks`
- [x] T044 Visual QA pass against `docs/ux-design-guide.md`: verify ambient orb background (§4.1), glass tokens (§1.2), accent color mapping (§1.3), card shimmer lines (§4.2), column header sticky offset (§4.4), and interaction transitions (§5) are all applied correctly across `TopicSection`, `NewsCard`, `ItemDetail`, and `Header`
- [ ] T045 [P] Run quickstart.md end-to-end: fresh install → generate content via Claude Code → `npm run dev` → verify full user flow in browser
- [ ] T046 [P] Update `README.md` setup instructions to match final `npm` scripts and environment variable requirements

---

## Post-MVP Improvements

> Tracked in `specs/001-ainews-knowledge-hub/plans/`. Each plan is a
> self-contained Claude Code instruction document.

### Batch 1 — UX Improvements (completed 2026-03-31)

See full detail: [`plans/002-ux-improvements.md`](plans/002-ux-improvements.md)

- [x] T047 Add interactive bookmark button to `NewsCard` feed card
- [x] T048 Fix Key Concepts chip colors to use topic accent (Breakdown + ItemDetail)
- [x] T049 Replace inline `style` prop with Tailwind classes on ItemDetail bookmark button
- [x] T050 Add `✓ Checked` completion badge to feed cards (NewsCard)
- [x] T051 Fix related content hover border to use topic accent color (RelatedContent)
- [x] T052 Improve knowledge check completion view with per-question breakdown (KnowledgeCheck)
- [x] T053 Implement mobile horizontal tab row per design guide §4.8 (NewsFeed)

### Batch 2 — Video Thumbnail Preview (done)

See full detail: [`plans/003-video-thumbnail.md`](plans/003-video-thumbnail.md)

- [x] T054 Add static YouTube thumbnail preview with play button overlay to video cards (NewsCard)

### Batch 3 — Feed Enhancements (completed 2026-04-02)

See full detail: [`plans/004-feed-enhancements.md`](plans/004-feed-enhancements.md)

- [x] T055 Extract shared `formatDate` utility and update NewsCard + ItemDetail
- [x] T056 Create `sortItemsVideosFirst` utility and sort videos first in topic columns (NewsFeed)
- [x] T057 Manifest-based multi-file news loading with deduplication (NewsContext)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — **BLOCKS all user stories**
- **US1 (Phase 3)**: Depends on Foundational — no dependency on US2–US5
- **US2 (Phase 4)**: Depends on Foundational + US1 (ItemDetail component exists)
- **US3 (Phase 5)**: Depends on Foundational + US1 (ItemDetail component exists)
- **US4 (Phase 6)**: Depends on Foundational + US1 (ItemDetail component exists)
- **US5 (Phase 7)**: Claude Code trigger setup — independent of UI work
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1**: Starts after Foundational — no story dependencies
- **US2**: Needs `ItemDetail` from US1 to add bookmark/notes UI
- **US3**: Needs `ItemDetail` from US1 to add knowledge check section
- **US4**: Needs `ItemDetail` from US1 to add related content section
- **US5**: Independent — content generation has no UI dependencies

### Within Each User Story

- Hooks before components that consume them
- Shared components before composite components
- Pages last (after all sub-components are ready)

### Parallel Opportunities

```bash
# Phase 1 — run together:
T002 (Tailwind config) + T003 (app deps) + T004 (seed deps) + T005 (tsconfig)

# Phase 2 — run together after T007:
T008 (useLocalStorage) + T011 (useNews) + T013 (Header) + T014 (ErrorState) + T015 (EmptyState) + T016 (cn)

# Phase 3 (US1) — run together:
T017 (TopicFilter) + T018 (NewsCard) + T021 (VideoPlayer) + T022 (Breakdown)

# Phase 4 (US2) — run together after T026, T027:
T028 (bookmark button) + T029 (notes textarea) + T030 (card indicator) + T031 (BookmarkCard)

# Phase 7 (US5) — independently of US1–US4:
T041 Claude Code trigger setup can happen any time
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and validate**: Feed loads, filtering works, item detail shows video + breakdown
5. Demo-ready MVP

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → validate independently → **MVP**
3. US2 → validate independently → bookmarks + notes working
4. US3 → validate independently → knowledge checks working
5. US4 → validate independently → related content working
6. US5 → validate independently → Claude Code trigger producing real data
7. Polish → final validation

### Parallel Strategy (if working across sessions)

- Session A: US1 + US2 + US3 + US4 (UI features, sequential)
- Session B: US5 (Claude Code trigger, fully independent)

---

## Notes

- `[P]` tasks operate on different files — safe to run in parallel
- US2, US3, US4 all modify `ItemDetail.tsx` sequentially — do not parallelize
- Commit after each user story phase checkpoint
- T006 (mock `news.json`) enables all UI work before the Claude Code trigger is configured
