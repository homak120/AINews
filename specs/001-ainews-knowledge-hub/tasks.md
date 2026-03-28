# Tasks: AINews Knowledge Hub

**Input**: Design documents from `specs/001-ainews-knowledge-hub/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | data-model.md ✅ | contracts/ ✅ | research.md ✅

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks grouped by user story for independent implementation and
testing. Each story phase can be started, completed, and validated on its own.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task belongs to (US1–US5)

---

## Phase 1: Setup

**Purpose**: Scaffold project, install dependencies, configure tooling.

- [ ] T001 Scaffold Vite + React + TypeScript project: `npm create vite@latest . -- --template react-ts` at repo root
- [ ] T002 [P] Install and configure Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`; update `tailwind.config.js` content paths and `src/index.css` with Tailwind directives
- [ ] T003 [P] Install app dependencies: `npm install react-router-dom axios react-lite-youtube-embed clsx tailwind-merge`
- [ ] T004 [P] Install seed script dependencies: `npm install -D @anthropic-ai/sdk tsx`
- [ ] T005 [P] Set TypeScript strict mode: ensure `tsconfig.json` has `"strict": true`, `"noUncheckedIndexedAccess": true`
- [ ] T006 Create `data/news.json` with 4 mock items (one per topic: `ai-software-engineering`, `ai-research-cs`, `ai-job-market`, `ai-products-industry`; valid schema from `contracts/news-schema.md`) to unblock all UI development before the seed script is built

---

## Phase 2: Foundational

**Purpose**: Shared types, hooks, contexts, and routing that ALL user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T007 Define all TypeScript types in `src/types/index.ts`: `ContentType`, `Topic`, `KnowledgeCheck`, `NewsItem`, `NewsData`, `KnowledgeCheckResult`, `UserPreferences` — exact interfaces from `data-model.md`
- [ ] T008 [P] Create `useLocalStorage<T>` base hook in `src/hooks/useLocalStorage.ts`: typed wrapper returning `[value, setValue, remove]`; handles JSON serialization, try-catch, and missing-key default
- [ ] T009 Create `NewsContext` in `src/context/NewsContext.tsx`: loads `data/news.json` via Axios on mount; provides `{ data, isLoading, error }`; shows `ErrorState` if file missing or malformed
- [ ] T010 Create `UserPreferencesContext` in `src/context/UserPreferencesContext.tsx`: reads/writes `ainews:preferences` localStorage key; provides `{ preferences, updateBookmarks, updateNotes, updateKnowledgeCheckResults }`
- [ ] T011 [P] Create `useNews()` hook in `src/hooks/useNews.ts`: consumes `NewsContext`; exposes `{ items, getById, getByTopic, isLoading, error }`; `getByTopic(topic)` MUST filter using `item.topics.includes(topic)` to support multi-topic items
- [ ] T012 Create centralized route definitions and wrap app with providers in `src/main.tsx`: `BrowserRouter`, `NewsContext.Provider`, `UserPreferencesContext.Provider`; routes: `/` → `HomePage`, `/item/:id` → `ItemDetailPage`, `/bookmarks` → `BookmarksPage`
- [ ] T013 [P] Create `Header` component in `src/components/layout/Header.tsx`: app name/logo on left; nav links to Home (`/`) and Bookmarks (`/bookmarks`)
- [ ] T014 [P] Create `ErrorState` component in `src/components/common/ErrorState.tsx`: accepts `message` prop; used for missing/malformed `news.json` and unknown item IDs
- [ ] T015 [P] Create `EmptyState` component in `src/components/common/EmptyState.tsx`: accepts `message` prop; used for empty topic filter results and empty bookmarks list
- [ ] T015a [P] Create `LoadingState` component in `src/components/common/LoadingState.tsx`: accepts optional `message` prop (default: "Loading…"); renders a centered spinner or skeleton placeholder; used in `HomePage` while `NewsContext` `isLoading === true`
- [ ] T016 [P] Create `cn()` utility in `src/utils/cn.ts`: `import { type ClassValue, clsx } from 'clsx'; import { twMerge } from 'tailwind-merge'; export const cn = (...args: ClassValue[]) => twMerge(clsx(...args))`

**Checkpoint**: Providers mounted, routes registered, base hooks + shared components ready. User story work can begin.

---

## Phase 3: User Story 1 — Browse Curated AI News Feed (Priority: P1) 🎯 MVP

**Goal**: User opens the app, sees all 4 topic sections with news cards, can filter by topic, and clicks into a full item detail with embedded video and educational breakdown.

**Independent Test**: Start the dev server with mock `data/news.json`. Verify all 4 topic sections load on home page, topic filter hides/shows correctly, clicking a card opens the item detail with video player and breakdown visible.

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create `TopicFilter` component in `src/components/layout/TopicFilter.tsx`: renders 5 pill buttons ("All" + one per topic); highlights active selection; calls `onSelect(topic | null)` callback; uses topic display names from `data-model.md`
- [ ] T018 [P] [US1] Create `NewsCard` component in `src/components/feed/NewsCard.tsx`: displays title, content type badge (video/article/paper/social), publication date, and first sentence of summary as teaser; entire card is a `<Link>` to `/item/:id`
- [ ] T019 [US1] Create `TopicSection` component in `src/components/feed/TopicSection.tsx`: renders topic display name as section header + list of `NewsCard` components for that topic; shows `EmptyState` if no items; NOTE: `getByTopic(topic)` MUST return items where `item.topics` array **includes** the topic value (not strict equality) to support multi-topic items appearing in multiple sections (depends on T017, T018)
- [ ] T020 [US1] Create `NewsFeed` component in `src/components/feed/NewsFeed.tsx`: renders `TopicFilter` + all 4 `TopicSection` components when no filter active; renders single `TopicSection` when filter selected; multi-topic items will appear in each section whose topic is included in `item.topics` (depends on T017, T019)
- [ ] T021 [P] [US1] Create `VideoPlayer` component in `src/components/item/VideoPlayer.tsx`: wraps `react-lite-youtube-embed`; accepts `youtubeId` prop; shows fallback `<a href={sourceUrl}>Watch on YouTube</a>` if video unavailable
- [ ] T022 [P] [US1] Create `Breakdown` component in `src/components/item/Breakdown.tsx`: renders `summary` paragraph, `keyConcepts` as a bulleted list, and `whyItMatters` highlighted section
- [ ] T023 [US1] Create `ItemDetail` component in `src/components/item/ItemDetail.tsx`: layout shell combining `VideoPlayer` (if video type), `Breakdown`, source metadata (type badge, `publishedAt`, `sourceUrl` link); accepts `item: NewsItem` prop (depends on T021, T022)
- [ ] T024 [US1] Create `HomePage` in `src/pages/HomePage.tsx`: renders `Header` + `LoadingState` while `isLoading === true` (from `useNews()`), then `NewsFeed`; manages active topic filter state via `useState` (depends on T013, T015a, T020)
- [ ] T025 [US1] Create `ItemDetailPage` in `src/pages/ItemDetailPage.tsx`: reads `:id` from URL params; calls `getById(id)`; renders `ItemDetail` or `ErrorState` if item not found (depends on T011, T023)

**Checkpoint**: User Story 1 fully functional — app loads, feed displays, filtering works, item detail shows with video and breakdown.

---

## Phase 4: User Story 2 — Bookmarks and Personal Notes (Priority: P2)

**Goal**: User bookmarks any item, adds a personal note, closes the browser, and returns to find both intact.

**Independent Test**: Bookmark an item in `ItemDetail`, add a note, close and reopen the browser. Verify the bookmark icon is filled, the note text is still present, and the item appears in `/bookmarks`.

### Implementation for User Story 2

- [ ] T026 [US2] Create `useBookmarks()` hook in `src/hooks/useBookmarks.ts`: consumes `UserPreferencesContext`; exposes `{ bookmarks, toggle(id), isBookmarked(id) }`
- [ ] T027 [US2] Create `useNotes()` hook in `src/hooks/useNotes.ts`: consumes `UserPreferencesContext`; exposes `{ getNote(id), setNote(id, text) }`; debounce writes by 500ms
- [ ] T028 [US2] Add bookmark toggle button to `src/components/item/ItemDetail.tsx`: imports `useBookmarks()`; renders filled/outline bookmark icon; calls `toggle(item.id)` on click (depends on T026)
- [ ] T029 [US2] Add notes textarea to `src/components/item/ItemDetail.tsx`: imports `useNotes()`; pre-fills with existing note; saves on change via `setNote` (depends on T027)
- [ ] T030 [P] [US2] Add bookmark indicator dot to `src/components/feed/NewsCard.tsx`: imports `useBookmarks()`; shows a small visual indicator when `isBookmarked(item.id)` is true (depends on T026)
- [ ] T031 [P] [US2] Create `BookmarkCard` component in `src/components/bookmarks/BookmarkCard.tsx`: shows item title, type badge, note preview (first 80 chars); entire card links to `/item/:id`
- [ ] T032 [US2] Create `BookmarksList` component in `src/components/bookmarks/BookmarksList.tsx`: maps `bookmarks` array to `BookmarkCard` components; resolves each ID via `getById()`; shows `EmptyState` when list is empty (depends on T011, T031)
- [ ] T033 [US2] Create `BookmarksPage` in `src/pages/BookmarksPage.tsx`: renders `Header` + `BookmarksList` (depends on T013, T032)

**Checkpoint**: User Story 2 fully functional — bookmarks toggle and persist, notes auto-save and persist, bookmarks page lists saved items.

---

## Phase 5: User Story 3 — Knowledge Checks (Priority: P3)

**Goal**: After reading an item with knowledge check questions, user answers them and gets immediate feedback with explanations. Completion state persists across sessions.

**Independent Test**: Open an item detail for a mock item with `knowledgeChecks` populated. Answer a question — verify correct/incorrect feedback and explanation appear. Reload the page — verify the check shows as completed.

### Implementation for User Story 3

- [ ] T034 [US3] Create `useKnowledgeChecks()` hook in `src/hooks/useKnowledgeChecks.ts`: consumes `UserPreferencesContext`; exposes `{ getResult(id), saveResult(id, answers), isCompleted(id) }`
- [ ] T035 [US3] Create `KnowledgeCheck` component in `src/components/item/KnowledgeCheck.tsx`: renders 2-3 multiple-choice questions; handles answer selection; shows ✅/❌ feedback and explanation immediately after selection; shows completion summary if `isCompleted`; calls `saveResult` on completion (depends on T034)
- [ ] T036 [US3] Integrate `KnowledgeCheck` into `src/components/item/ItemDetail.tsx`: render `<KnowledgeCheck item={item} />` only when `item.knowledgeChecks.length > 0` (depends on T035)

**Checkpoint**: User Story 3 fully functional — knowledge checks render, answer feedback works, completion persists across sessions.

---

## Phase 6: User Story 4 — Related Content (Priority: P4)

**Goal**: After reading an item, the user sees 2-4 related items at the bottom and can navigate to any of them.

**Independent Test**: Open an item detail for a mock item with `relatedIds` populated. Verify related items appear at the bottom. Click one — verify navigation to its detail view.

### Implementation for User Story 4

- [ ] T037 [US4] Create `RelatedContent` component in `src/components/item/RelatedContent.tsx`: accepts `relatedIds: string[]`; resolves each to a `NewsItem` via `getById()`; renders compact cards (title + type badge) as `<Link>` to `/item/:id`; silently skips IDs that don't resolve (depends on T011)
- [ ] T038 [US4] Integrate `RelatedContent` into `src/components/item/ItemDetail.tsx`: render `<RelatedContent relatedIds={item.relatedIds} />` only when `item.relatedIds.length > 0` (depends on T037)

**Checkpoint**: User Story 4 fully functional — related content section renders and navigation works.

---

## Phase 7: User Story 5 — Weekly Content Seed Script (Priority: P5)

**Goal**: Operator runs `npm run seed` and gets a valid `data/news.json` covering the past 7 days across all 4 topic areas, with AI-generated summaries, key concepts, why-it-matters, knowledge checks, and related item links.

**Independent Test**: Run `npm run seed`. Inspect `data/news.json` — verify it contains ≥3 items per topic, all required fields are populated, `relatedIds` reference valid IDs, and `knowledgeChecks` have valid `correctIndex` values.

### Implementation for User Story 5

- [ ] T039 [US5] Create `scripts/seed.ts`: Anthropic SDK script that (1) constructs a prompt instructing Claude to search the web for the past 7 days of AI news across all 4 topic areas, (2) requests structured JSON output conforming to `contracts/news-schema.md`, (3) writes the result to `data/news.json`; uses `ANTHROPIC_API_KEY` env var
- [ ] T040 [US5] Add `"seed": "tsx scripts/seed.ts"` to `package.json` scripts
- [ ] T041 [US5] Run `npm run seed` to generate the first real `data/news.json`; review output; manually adjust any items if needed; commit the file

**Checkpoint**: Seed script runs end-to-end and produces valid `data/news.json` that the app loads correctly.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final touches that span multiple user stories.

- [ ] T042 Add bookmark count badge to `Header` Bookmarks nav link in `src/components/layout/Header.tsx`: shows number of bookmarked items when > 0
- [ ] T043 Verify all deep-links work: `/`, `/item/:id` with valid ID, `/item/:id` with unknown ID (ErrorState), `/bookmarks`
- [ ] T044 Review Tailwind spacing and typography for readability on desktop and tablet viewports; adjust `TopicSection`, `NewsCard`, `ItemDetail` as needed
- [ ] T045 [P] Run quickstart.md end-to-end: fresh install → `npm run seed` → `npm run dev` → verify full user flow in browser
- [ ] T046 [P] Update `README.md` setup instructions to match final `npm` scripts and environment variable requirements

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — **BLOCKS all user stories**
- **US1 (Phase 3)**: Depends on Foundational — no dependency on US2–US5
- **US2 (Phase 4)**: Depends on Foundational + US1 (ItemDetail component exists)
- **US3 (Phase 5)**: Depends on Foundational + US1 (ItemDetail component exists)
- **US4 (Phase 6)**: Depends on Foundational + US1 (ItemDetail component exists)
- **US5 (Phase 7)**: Depends on Setup only — can be built in parallel with US1–US4
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1**: Starts after Foundational — no story dependencies
- **US2**: Needs `ItemDetail` from US1 to add bookmark/notes UI
- **US3**: Needs `ItemDetail` from US1 to add knowledge check section
- **US4**: Needs `ItemDetail` from US1 to add related content section
- **US5**: Independent — seed script has no UI dependencies

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
T039 + T040 can be built any time after Phase 1 Setup
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
6. US5 → validate independently → seed script producing real data
7. Polish → final validation

### Parallel Strategy (if working across sessions)

- Session A: US1 + US2 + US3 + US4 (UI features, sequential)
- Session B: US5 (seed script, fully independent)

---

## Notes

- `[P]` tasks operate on different files — safe to run in parallel
- US2, US3, US4 all modify `ItemDetail.tsx` sequentially — do not parallelize
- Commit after each user story phase checkpoint
- T006 (mock `news.json`) enables all UI work before the seed script (T039) is built
- The seed script (T039) uses `ANTHROPIC_API_KEY` — set in shell before running
