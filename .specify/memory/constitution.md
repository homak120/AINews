<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0 (initial ratification)

Modified principles: N/A — first fill of template

Added sections:
  - Core Principles (6 principles)
  - Technology Stack
  - Deployment Strategy
  - Governance

Removed sections: N/A

Templates reviewed:
  ✅ .specify/templates/plan-template.md — Constitution Check section present; aligns with principles
  ✅ .specify/templates/spec-template.md — FR/SC structure compatible with data-first approach
  ✅ .specify/templates/tasks-template.md — Phase structure supports phased delivery model

Deferred items:
  - None. All placeholders resolved.
-->

# AINews Constitution

## Core Principles

### I. React SPA with TypeScript (NON-NEGOTIABLE)

AINews is a single-page application. All UI MUST be built with React. All code
(components, utilities, types, hooks) MUST be written in TypeScript with strict
mode enabled. No plain JavaScript files permitted in `src/`. Type definitions
MUST be explicit — `any` is forbidden except at verified external API boundaries
with a justification comment.

### II. React Router for Navigation

All client-side routing MUST use React Router. There is no server-side routing
in Phase 1. Route definitions MUST be centralized (not scattered across
components). Deep-linking to topic views and individual news items MUST work
via URL.

### III. Tailwind CSS for Styling

All styling MUST use Tailwind CSS utility classes. No custom CSS files,
CSS-in-JS, or external component libraries (e.g., MUI, Chakra) are permitted
unless explicitly amended. Component variants MUST be expressed via Tailwind's
`clsx`/`cn` pattern, not inline style props.

### IV. Static-Data-First (Phase 1 Constraint)

In Phase 1, the application MUST read content exclusively from a static
`data/news.json` file. No live API calls to external services are permitted in
Phase 1. Axios is available but MUST only be used for local JSON loading or
future Phase 2 integrations — it MUST NOT be used to call external APIs in MVP.
The JSON schema for `news.json` is the contract: any change to it MUST be
treated as a breaking change and updated consistently across all consumers.

### V. Lightweight State Management Only

Global state MUST be managed using React built-ins: `useState`, `useReducer`,
and the Context API. No Redux, Zustand, Jotai, or other external state libraries
are permitted in Phase 1. State MUST be scoped as locally as possible — only
promote to Context when genuinely shared across multiple unrelated components.
User preferences (bookmarks, notes) MUST be persisted to `localStorage`.

### VI. Simplicity & Phase-Aware Scope (YAGNI)

Every implementation decision MUST be scoped to the current phase. Phase 1 MUST
NOT build abstractions, APIs, or infrastructure intended for Phase 2. Complexity
MUST be justified in the Complexity Tracking section of the relevant plan.
If a simpler approach delivers the same user outcome, the simpler approach MUST
be chosen.

## Technology Stack

| Concern | Choice | Notes |
|---|---|---|
| **Language** | TypeScript (strict) | All source files |
| **UI Framework** | React 18+ | Functional components + hooks only |
| **Routing** | React Router v6+ | Client-side SPA routing |
| **Styling** | Tailwind CSS | Utility-first, no custom CSS |
| **HTTP Client** | Axios | Phase 1: local JSON only |
| **State** | useState / useReducer / Context API | No external state libs |
| **Data Source** | `data/news.json` (static) | Phase 1 only |
| **Persistence** | localStorage | Bookmarks, notes, preferences |

**Content Topics**: AI Engineering & Skill Development · AI Research & Future
Technology · AI Career & Workforce Intelligence · AI Industry Strategy &
Product Landscape

**Content Types**: YouTube videos (embedded), articles, arXiv papers,
X/social posts from key AI figures

**Interactive Features**: Bookmarks, per-item notes/annotations, knowledge
checks (2-3 questions per item), related content suggestions

## Deployment Strategy

- **Phase 1 (MVP)**: Self-hosted — runs locally or on a personal VPS.
  No CI/CD required. Weekly content refresh = run the Claude Code trigger
  and redeploy.
- **Phase 2**: Migrate to Vercel. All code MUST be written to be
  Vercel-compatible from day one (no server-only Node.js assumptions in
  frontend code, no hardcoded localhost URLs).
- **Auth**: Lightweight — single user + small friend group. No heavy auth
  system in Phase 1. If access control is needed, environment-level
  protection (e.g., Vercel password protection) is sufficient.

## Governance

This constitution supersedes all other practices and conventions for the AINews
project. All feature specs, implementation plans, and task lists MUST be checked
against these principles before work begins.

**Amendment procedure**: Any change to a principle requires incrementing the
constitution version (MAJOR for removals/redefinitions, MINOR for additions,
PATCH for clarifications), updating `LAST_AMENDED_DATE`, and documenting the
rationale inline.

**Compliance**: Every plan.md MUST include a Constitution Check section that
explicitly gates work against these principles before Phase 0 research begins.

**Version policy**: `MAJOR.MINOR.PATCH` — semantic versioning applies to
governance changes as described above.

**Version**: 1.0.0 | **Ratified**: 2026-03-28 | **Last Amended**: 2026-03-28
