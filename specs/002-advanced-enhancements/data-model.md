# Data Model: Advanced Enhancements

**Branch**: `002-advanced-enhancements` | **Date**: 2026-04-03

## Existing Entities (unchanged)

### NewsItem

Already defined in `src/types/index.ts`. Relevant fields for filtering:

| Field | Type | Filter Role |
|-------|------|-------------|
| `type` | `ContentType` (`'video' \| 'article' \| 'paper' \| 'social'`) | Content type filter |
| `topics` | `Topic[]` | Topic filter (existing) |
| `tags` | `string[]` | Tag filter |
| `publishedAt` | `string` (ISO date: `'2026-04-01'`) | Date range filter |
| `title` | `string` | Text search |
| `summary` | `string` | Text search |

No changes to `NewsItem` schema.

### UserPreferences

Extended with `savedSearches` field:

| Field | Type | Description |
|-------|------|-------------|
| `bookmarks` | `string[]` | Bookmarked item IDs (existing) |
| `notes` | `Record<string, string>` | Per-item notes (existing) |
| `knowledgeCheckResults` | `Record<string, KnowledgeCheckResult>` | Quiz results (existing) |
| `savedSearches` | `SavedSearch[]` | Saved filter snapshots (NEW) |

**Default value**: `savedSearches: []`

**Migration**: Existing localStorage data has no `savedSearches` field.
The `useLocalStorage` hook returns the default value when a field is missing,
so no explicit migration needed. The first call to `updateSavedSearches` will
add the field.

## New Entities

### FilterState

Represents the complete set of active filter criteria. Used as transient
UI state (not persisted) and as the payload within `SavedSearch`.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `contentType` | `ContentTypeFilterValue` | `'all'` | Active content type filter |
| `activeTopic` | `Topic \| null` | `null` | Active topic filter |
| `activeTag` | `string \| null` | `null` | Active tag filter (single tag) |
| `dateRange` | `DateRange \| null` | `null` | Active date range filter |
| `textQuery` | `string` | `''` | Active text search query |

### ContentTypeFilterValue

Union type for content type filter options:

```
'all' | 'video' | 'article' | 'paper' | 'social'
```

`'all'` means no content type filtering (show everything).

### DateRange

| Field | Type | Description |
|-------|------|-------------|
| `start` | `string` | Start date (ISO format, inclusive) |
| `end` | `string` | End date (ISO format, inclusive) |

**Validation**: `end >= start`. Invalid ranges are prevented by UI.

### SavedSearch

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique ID (format: `'ss-' + Date.now()`) |
| `name` | `string` | User-provided display name |
| `filters` | `FilterState` | Snapshot of all filter criteria at save time |

**Constraints**:
- Maximum 5 saved searches per user
- `name` must be non-empty (enforced by UI)
- `id` is auto-generated, not user-editable

## State Transitions

### FilterState Lifecycle

```
INITIAL (all defaults)
  → user clicks content type pill → contentType updated
  → user clicks tag chip → activeTag updated (replaces previous)
  → user sets date range → dateRange updated
  → user types search → textQuery updated
  → user clicks topic pill → activeTopic updated
  → user clicks "Reset all" → return to INITIAL
  → user loads saved search → all fields replaced with snapshot
```

**Single tag rule**: Clicking a new tag replaces the active tag (no
multi-select). Clicking the same tag again clears it.

### SavedSearch Lifecycle

```
(empty list)
  → user clicks "Save" with active filters → new SavedSearch created
     (if count < 5; else show limit warning)
  → user clicks saved search chip → FilterState loaded from snapshot
  → user clicks delete on chip → SavedSearch removed
```

## Relationships

```
FilterState (transient)
  ├── used by: HomePage, NewsFeed, AdvancedSearch
  ├── serialized into: SavedSearch.filters
  └── applied to: NewsItem[] (produces filtered list)

SavedSearch (persisted)
  ├── stored in: UserPreferences.savedSearches
  ├── contains: FilterState snapshot
  └── max count: 5

NewsItem (read-only, from JSON)
  ├── filtered by: FilterState criteria
  └── displays: tags (clickable → updates FilterState.activeTag)
```
