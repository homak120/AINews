# Research: AINews Knowledge Hub

**Branch**: `001-ainews-knowledge-hub` | **Date**: 2026-03-28

## 1. Build Tool

**Decision**: Vite
**Rationale**: CRA is no longer actively maintained. Vite starts in <2s, has
native TypeScript + Tailwind support, and has first-class Vercel deployment
support. Shared `vite.config.ts` between app and tests eliminates config drift.
**Alternatives considered**: Create React App — legacy toolchain, slow, limited
customization.

## 2. YouTube Embedding

**Decision**: `react-lite-youtube-embed`
**Rationale**: Raw iframes and `react-youtube` both load ~500KB of YouTube
scripts before user interaction. `react-lite-youtube-embed` renders a thumbnail
first and loads the full iframe only on click — dramatically improving initial
page load with zero UX cost. Better Lighthouse scores align with Vercel
deployment best practices.
**Alternatives considered**: `react-youtube` — convenient but heavy; raw
`<iframe>` — simplest but worst performance impact per video on the page.

## 3. Testing Framework

**Decision**: Vitest
**Rationale**: Vitest integrates directly with Vite — shares `vite.config.ts`,
native ESM + TypeScript support, 10–20x faster than Jest in watch mode.
95% Jest-compatible API means no relearning. Affected tests re-run in <300ms.
**Alternatives considered**: Jest — viable but requires separate config, slower
with TypeScript transforms, no native Vite integration.

## 4. localStorage Management

**Decision**: Custom `useLocalStorage<T>` hook (thin wrapper)
**Rationale**: Encapsulates JSON serialization, try-catch error handling, and
SSR guards in one reusable hook. Type-safe via generics. Returns
`[value, setValue, remove]` — identical mental model to `useState`. Composes
cleanly into domain hooks (`useBookmarks`, `useNotes`, `useKnowledgeChecks`).
**Alternatives considered**: Raw `localStorage` API — verbose, error-prone,
requires manual JSON handling in every consumer.

## 5. Seed Script Runtime

**Decision**: Node.js TypeScript script using `@anthropic-ai/sdk`
**Rationale**: Programmatic control over prompting, web search tool use,
structured JSON output, retry logic, and error handling. TypeScript matches the
project's language. The Anthropic SDK supports tool use (web search) natively,
enabling the LLM to discover recent AI news and structure it into `news.json`
schema in a single pass. Operator reviews and optionally edits the output
before committing.
**Alternatives considered**: Markdown prompt file — no automation, no structured
output guarantee, requires manual copy-paste.

## 6. CSS Class Composition

**Decision**: `clsx` + `tailwind-merge`
**Rationale**: `clsx` is 311 bytes (vs `classnames` ~1.5KB) with identical API.
`tailwind-merge` resolves Tailwind specificity conflicts when combining
conditional classes (e.g., `bg-blue-500` + `bg-red-500` → last wins). The
`cn()` utility pattern (`cn = (...args) => twMerge(clsx(args))`) is the
standard convention in the Tailwind + React ecosystem.
**Alternatives considered**: `classnames` — larger, no conflict resolution;
raw template literals — no conflict resolution, error-prone with many conditions.

## 7. Project Scaffolding Command

```bash
npm create vite@latest ainews -- --template react-ts
cd ainews
npm install
npx tailwindcss init -p
```

**Core dependencies**:
```
react-router-dom       # routing
axios                  # local JSON loading
react-lite-youtube-embed  # video embedding
clsx                   # class composition
tailwind-merge         # Tailwind conflict resolution
```

**Dev dependencies**:
```
vitest                 # testing
@testing-library/react # component testing
@testing-library/jest-dom
```

**Seed script dependencies** (separate or devDependency):
```
@anthropic-ai/sdk      # LLM + web search for content generation
tsx                    # run TypeScript scripts directly
```
