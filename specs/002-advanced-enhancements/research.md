# Research: Advanced Enhancements

**Branch**: `002-advanced-enhancements` | **Date**: 2026-04-03

## Overview

No external unknowns to resolve. The tech stack (TypeScript, React 18,
Tailwind CSS, localStorage) is fully established from Phase 1. This document
records design decisions for the new filtering features.

## Decisions

### 1. Filter State Management

**Decision**: Single `useFilterState` custom hook with `useState` at
`HomePage` level.

**Rationale**: All filter criteria need to be accessible from multiple
components (TopicFilter, ContentTypeFilter, TagChips, AdvancedSearch,
SavedSearches, NewsFeed). Lifting state to `HomePage` and passing via props
follows the existing pattern (search query + active topic are already managed
this way). A Context is unnecessary since all consumers are within the
`HomePage` component tree.

**Alternatives considered**:
- New FilterContext: Rejected — adds complexity for no benefit since all
  consumers share a single parent component.
- Extend existing `UserPreferencesContext`: Rejected — preferences are for
  persistent user data (bookmarks, notes). Transient filter state doesn't
  belong there.
- URL search params for all filters: Rejected as primary state — would make
  the URL unwieldy. Used only for `tag` param (deep-link from detail page).

### 2. Tag Filter URL Strategy

**Decision**: Use `?tag=tagname` query parameter only for cross-page
navigation (detail → home). Filter state is not synced to URL for other
criteria.

**Rationale**: The tag filter needs URL support because clicking a tag on the
detail page navigates back to the home feed. Other filters (content type,
date range) don't need URL state because they're only used within the home
page. Keeping the URL simple avoids complexity and matches the current
app behavior (no URL state for topic or sort).

**Alternatives considered**:
- Full URL state for all filters: Rejected — adds URL parsing complexity,
  makes URLs ugly, no clear user benefit for a single-user app.
- React Router state (`location.state`): Rejected — doesn't survive page
  refresh and isn't bookmarkable.

### 3. Saved Search Storage

**Decision**: Extend existing `UserPreferences` object in
`ainews:preferences` localStorage key with a `savedSearches` array.

**Rationale**: Follows the established pattern. The `useLocalStorage` hook
and `UserPreferencesContext` already handle persistence, error handling
(quota exceeded), and cross-component sync. Adding a new field is the
simplest change.

**Alternatives considered**:
- Separate localStorage key: Rejected — would require a separate hook and
  wouldn't benefit from the existing Context sync.
- IndexedDB: Rejected — overkill for storing 5 small JSON objects.

### 4. Content Type Pill Accent Color

**Decision**: Use neutral white accent (matching sort order pills) rather
than content-type-specific colors.

**Rationale**: Content type pills sit alongside topic-colored pills. Adding
more colors would create visual noise. The sort order pills already use a
neutral white/gray style that works well for non-topic controls.

**Alternatives considered**:
- Per-type colors (e.g., red for video, blue for article): Rejected — too
  many competing color signals in the filter bar.
