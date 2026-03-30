# AINews — UX Design Guide

> **For Claude Code:** Read this file at the start of every UI implementation task. All values are explicit and copy-pasteable. No external references are required to interpret this document.
>
> **Intent:** AINews must feel like a premium, AI-native intelligence terminal — not a generic news site. Every surface floats over deep space. Glass panels catch ambient light. The aesthetic signals sophistication without sacrificing readability.

---

## 1. Color Palette

### 1.1 Background System

| Role | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| Page background | `#060a14` | `bg-[#060a14]` | `<body>` and root container |
| Surface base | `#0d1526` | `bg-[#0d1526]` | First-level panels, nav bar |
| Surface raised | `#121f38` | `bg-[#121f38]` | Elevated panels, dropdowns |

### 1.2 Glass Overlay Values

| Role | Value | Tailwind Approximation |
|------|-------|------------------------|
| Glass card fill | `rgba(255,255,255,0.06)` | `bg-white/[0.06]` |
| Glass card fill — hover | `rgba(255,255,255,0.10)` | `bg-white/[0.10]` |
| Glass border | `rgba(255,255,255,0.12)` | `border-white/[0.12]` |
| Glass border — hover | `rgba(255,255,255,0.20)` | `border-white/[0.20]` |
| Modal panel fill | `rgba(255,255,255,0.10)` | `bg-white/[0.10]` |
| Modal overlay | `rgba(0,0,0,0.60)` | `bg-black/60` |

### 1.3 Topic Accent Colors (Locked — Do Not Reassign)

| Topic | Accent Name | Hex | Tailwind Text | Tailwind BG | Tailwind Border |
|-------|-------------|-----|---------------|-------------|-----------------|
| AI Engineering & Skill Development | Violet | `#a78bfa` | `text-violet-400` | `bg-violet-500/10` | `border-violet-500/25` |
| AI Research & Future Technology | Cyan | `#22d3ee` | `text-cyan-400` | `bg-cyan-500/10` | `border-cyan-500/25` |
| AI Career & Workforce Intelligence | Emerald | `#34d399` | `text-emerald-400` | `bg-emerald-500/10` | `border-emerald-500/25` |
| AI Industry Strategy & Product Landscape | Amber | `#fbbf24` | `text-amber-400` | `bg-amber-500/10` | `border-amber-500/25` |

**Rule:** One accent per topic, everywhere — column headers, topic tags, filter chips, card border-hover. Never mix accent colors within a column or on a single card.

### 1.4 Text Colors

| Role | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| Primary text | `#f1f5f9` | `text-slate-100` | Headings, card titles, active UI |
| Secondary text | `#94a3b8` | `text-slate-400` | Body copy, summaries |
| Muted / metadata | `#64748b` | `text-slate-500` | Timestamps, source names, counts |

### 1.5 Semantic State Colors

| State | Color | Hex | Tailwind |
|-------|-------|-----|---------|
| Correct answer | Emerald | `#34d399` | `bg-emerald-500/15 border-emerald-500/35 text-emerald-400` |
| Wrong answer | Rose | `#fb7185` | `bg-rose-500/15 border-rose-500/35 text-rose-400` |
| Bookmark (hover) | Cyan | `#22d3ee` | `hover:text-cyan-400` |
| Bookmark (active/saved) | Cyan | `#22d3ee` | `text-cyan-400 border-cyan-400/22` (card border tint) |
| Focus ring | Cyan | `#22d3ee` | `focus:border-cyan-400/50` |

---

## 2. Typography

### 2.1 Font Families

| Role | Family | Tailwind Class |
|------|--------|----------------|
| Body / headings | System sans-serif stack | `font-sans` (default) |
| Labels, tags, metadata, source names | Monospace | `font-mono` |

AINews uses **no custom web fonts**. The system sans stack (`ui-sans-serif, system-ui, -apple-system`) is intentional — it loads fast and feels native.

### 2.2 Type Scale

| Token | Size | Weight | Line Height | Tailwind Classes | Usage |
|-------|------|--------|-------------|-----------------|-------|
| Heading primary | 24px | 600 | 1.2 | `text-2xl font-semibold tracking-tight text-slate-100` | Page headings, section titles |
| Card title | 15px | 600 | 1.4 | `text-[15px] font-semibold leading-snug text-slate-100 line-clamp-2` | News card headline |
| Body / summary | 14px | 400 | 1.6 | `text-sm leading-relaxed text-slate-400 line-clamp-3` | Card summary paragraph |
| Metadata | 12px | 400 | 1.4 | `text-xs text-slate-500 font-mono` | Source name, date, item count |
| Label / tag | 11px | 600 | — | `text-[11px] font-mono font-semibold tracking-widest uppercase` | Topic chips, column labels |
| Section overline | 13px | 600 | — | `text-[13px] font-semibold tracking-[0.1em] uppercase text-violet-400` | Section titles in UI |

### 2.3 Line Clamping Rules

- Card title: always `line-clamp-2` — never let it overflow the card boundary.
- Card summary: always `line-clamp-3`.
- These are hard constraints to prevent layout shift across columns.

---

## 3. Spacing & Layout

### 3.1 Grid System

| Context | Columns | Gap | Tailwind |
|---------|---------|-----|---------|
| Topic column dashboard | 4 equal columns | 16px | `grid grid-cols-4 gap-4` |
| Tablet (≤1024px) | 2 columns | 16px | `md:grid-cols-2` |
| Mobile (≤768px) | **Horizontal tab row** (see §4.8) — 4-column grid hidden | — | `hidden md:grid` on column grid |
| Item detail view | Article + quiz sidebar | 24px | `grid grid-cols-[1fr_380px] gap-6` |
| Reference / token grids | 2–3 columns | 20px | `grid grid-cols-2 gap-5` or `grid-cols-3` |

### 3.2 Page Container

```
max-width: 1280px
padding: 0 32px (desktop) / 0 20px (mobile)
margin: 0 auto
```

Tailwind: `max-w-[1280px] mx-auto px-8 md:px-5`

### 3.3 Spacing Scale (used consistently across components)

| Token | Value | Usage |
|-------|-------|-------|
| Card padding | `28px` (all sides) | `p-7` on glass cards |
| Card gap (column) | `16px` | `gap-4` between stacked cards |
| Column gap | `16px` | `gap-4` between topic columns |
| Section gap | `40px` | `mb-10` between major page sections |
| Filter chip gap | `8px` | `gap-2` in chip row |
| Tag internal padding | `4px 10px` | `py-1 px-2.5` |
| Chip internal padding | `6px 16px` | `py-1.5 px-4` |

### 3.4 Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|---------|-------|
| Card / large panel | `16px` | `rounded-2xl` | News cards, column headers, modal |
| Filter chips | `9999px` | `rounded-full` | Topic filter pills |
| Tag badges | `9999px` | `rounded-full` | In-card topic tags |
| Input field | `12px` | `rounded-xl` | Search input |
| Small elements | `8px` | `rounded-lg` | Buttons, copy chips |

---

## 4. Component Specifications

### 4.1 Ambient Orb Background

**Place this as the first child of the root layout, fixed behind all content. Required — glass is invisible without it.**

```jsx
{/* Ambient background — required for glassmorphism to render */}
<div className="fixed inset-0 pointer-events-none z-0">
  {/* Violet orb — top-left */}
  <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full
                  bg-[radial-gradient(circle,rgba(167,139,250,0.18)_0%,transparent_70%)]" />
  {/* Cyan orb — bottom-right */}
  <div className="absolute -bottom-[20%] -right-[10%] w-[700px] h-[700px] rounded-full
                  bg-[radial-gradient(circle,rgba(34,211,238,0.14)_0%,transparent_70%)]" />
  {/* Emerald orb — center */}
  <div className="absolute top-1/2 left-[40%] w-[400px] h-[400px] rounded-full
                  bg-[radial-gradient(circle,rgba(52,211,153,0.08)_0%,transparent_70%)]" />
</div>
```

---

### 4.2 Glass Card (News Card)

**Element structure:**

```
<article>                        glass card base + hover + relative + overflow-hidden
  ::before                       shimmer line at top (gradient)
  <header>
    <span>                       topic tag — pill, monospace, accent-colored
    <button>                     bookmark icon — ghost, cyan on hover
  <h2>                           article title — 2-line clamp
  <p>                            summary — 3-line clamp
  <footer>
    <span>                       source name — slate-500, monospace, text-xs
    <span>                       date — slate-500, monospace, text-xs
```

**Exact Tailwind classes:**

```jsx
// Card wrapper
<article className="
  relative overflow-hidden
  bg-white/[0.06] backdrop-blur-xl
  border border-white/[0.12]
  rounded-2xl p-7
  transition-all duration-200
  hover:bg-white/[0.10] hover:border-white/[0.20] hover:-translate-y-0.5
  before:absolute before:top-0 before:inset-x-0 before:h-px
  before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
  @supports not (backdrop-filter: blur(1px)) { bg-slate-900/90 }
">

  {/* Topic tag */}
  <span className="
    inline-block font-mono text-[11px] font-semibold tracking-widest uppercase
    px-2.5 py-1 rounded-full
    bg-violet-500/10 border border-violet-500/25 text-violet-400
  ">AI ENGINEERING</span>

  {/* Bookmark button — default / hover / saved states */}
  <button className="text-slate-600 hover:text-cyan-400 transition-colors">
    {/* BookmarkIcon 16px */}
  </button>
  {/* When bookmarked: add border-cyan-400/22 to the card wrapper and keep icon text-cyan-400 */}

  {/* Title */}
  <h2 className="text-[15px] font-semibold leading-snug text-slate-100 line-clamp-2 mt-3">
    Article title here
  </h2>

  {/* Summary */}
  <p className="text-sm leading-relaxed text-slate-400 line-clamp-3 mt-2">
    Summary text here
  </p>

  {/* Footer */}
  <footer className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
    <span className="text-xs text-slate-500 font-mono">arxiv.org</span>
    <span className="text-xs text-slate-500 font-mono">Mar 2026</span>
  </footer>

</article>
```

**Substitute accent classes per topic (replace all `violet` references):**
- Engineering → `violet-400 / violet-500`
- Research → `cyan-400 / cyan-500`
- Jobs → `emerald-400 / emerald-500`
- Products → `amber-400 / amber-500`

---

### 4.3 Search + Filter Bar

**Element structure:**

```
<div>                            search container
  <SearchIcon>                   16px, text-slate-500
  <input>                        glass search input, full-width
<div>                            filter chip row — flex, gap-2
  <button> × 5                   "All" + 4 topic chips
```

**Exact Tailwind classes:**

```jsx
{/* Search input wrapper */}
<div className="relative">
  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
  <input
    className="
      w-full pl-11 pr-4 py-3
      bg-white/[0.07] border border-white/[0.15]
      rounded-xl
      text-slate-100 placeholder:text-slate-500
      focus:outline-none focus:ring-0 focus:border-cyan-400/50
      transition-colors duration-200
      font-sans text-sm
    "
    placeholder="Search articles, topics, papers..."
  />
</div>

{/* Filter chip row */}
<div className="flex items-center gap-2 flex-nowrap overflow-x-auto mt-3 pb-1">

  {/* Active chip (e.g., "All" selected) */}
  <button className="
    flex-shrink-0
    bg-violet-500/15 border border-violet-500/30 text-violet-400
    rounded-full px-4 py-1.5
    text-xs font-semibold
    transition-all duration-200
  ">All</button>

  {/* Inactive chip */}
  <button className="
    flex-shrink-0
    bg-white/[0.04] border border-white/[0.10] text-slate-400
    rounded-full px-4 py-1.5
    text-xs
    hover:bg-white/[0.08] hover:text-slate-200
    transition-all duration-200
  ">Engineering</button>

</div>
```

---

### 4.4 Topic Column Header

**Element structure:**

```
<div>                            sticky header (sticky top-0, z-10)
  <span>                         topic label — monospace, uppercase, accent, text-xs
  <span>                         item count — slate-500, text-xs, right-aligned
```

**Exact Tailwind classes:**

```jsx
<div className="
  sticky top-[56px] z-10
  backdrop-blur-md
  bg-violet-500/[0.08]
  border border-violet-500/25
  border-b border-b-violet-500/25
  rounded-t-2xl
  px-4 py-3
  flex items-center justify-between
">
  {/* top-[56px] = nav bar height offset — adjust if nav height changes */}
  <span className="
    font-mono text-[11px] font-semibold tracking-widest uppercase
    text-violet-400
  ">AI Engineering & Skill Development</span>

  <span className="text-xs text-slate-500 font-mono">14</span>
</div>
```

**Substitute accent per column** (replace all `violet` references with the topic's accent, see §1.3).

---

### 4.5 Knowledge Quiz Modal

**Element structure:**

```
<div>                            overlay — fixed inset-0, bg-black/60, backdrop-blur-sm
  <div>                          modal panel — glass elevated
    <h3>                         question text — slate-100
    <div>                        options grid — flex-col, gap-3
      <button> × N               option buttons — glass style
    <div>                        result feedback (shown post-answer)
```

**Exact Tailwind classes:**

```jsx
{/* Overlay */}
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">

  {/* Modal panel */}
  <div className="
    relative overflow-hidden
    bg-white/[0.10] backdrop-blur-2xl
    border border-white/[0.15]
    rounded-2xl p-8
    max-w-2xl w-full
    before:absolute before:top-0 before:inset-x-0 before:h-px
    before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent
  ">
    <p className="text-[11px] font-mono font-semibold tracking-widest uppercase text-cyan-400 mb-4">
      Knowledge Check
    </p>
    <h3 className="text-slate-100 font-semibold text-lg leading-snug mb-6">
      Question text here
    </h3>

    <div className="flex flex-col gap-3">

      {/* Default option button */}
      <button className="
        w-full text-left p-4
        bg-white/[0.05] border border-white/[0.10]
        rounded-xl text-slate-300 text-sm
        hover:bg-white/[0.10] hover:border-white/[0.20]
        transition-all duration-150
      ">A. Option text</button>

      {/* Correct answer state */}
      <button className="
        w-full text-left p-4
        bg-emerald-500/20 border border-emerald-500/40
        rounded-xl text-emerald-400 text-sm font-medium
      ">B. Correct option ✓</button>

      {/* Wrong answer state — apply shake animation */}
      <button className="
        w-full text-left p-4
        bg-rose-500/20 border border-rose-500/40
        rounded-xl text-rose-400 text-sm font-medium
        animate-[shake_0.3s_ease-in-out]
      ">C. Wrong option ✗</button>

    </div>
  </div>
</div>
```

**Shake keyframe (add to Tailwind config or global CSS via `@layer utilities`):**

```js
// tailwind.config.js
keyframes: {
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '25%':      { transform: 'translateX(-4px)' },
    '75%':      { transform: 'translateX(4px)' },
  },
},
animation: {
  shake: 'shake 0.3s ease-in-out',
},
```

---

### 4.6 Navigation Bar

The nav bar contains the wordmark, an inline search field, and icon buttons. It sits at `z-20` and establishes the `56px` top offset used by sticky column headers.

```jsx
<nav className="
  sticky top-0 z-20
  bg-[#0d1526]/80 backdrop-blur-md
  border-b border-white/[0.08]
  px-8 py-4
  flex items-center justify-between
">
  {/* Wordmark */}
  <span className="text-slate-100 font-semibold text-lg tracking-tight">
    AI<span className="text-violet-400">News</span>
  </span>

  {/* Inline search — centred, constrained width */}
  <div className="relative flex-1 max-w-[480px] mx-10">
    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
    <input
      className="
        w-full pl-10 pr-4 py-2
        bg-white/[0.07] border border-white/[0.15]
        rounded-xl text-sm text-slate-100 placeholder:text-slate-500
        focus:outline-none focus:ring-0 focus:border-cyan-400/50
        transition-colors duration-200
      "
      placeholder="Search articles, topics, papers…"
    />
  </div>

  {/* Icon buttons */}
  <div className="flex items-center gap-3">
    <button className="
      w-9 h-9 rounded-[9px]
      flex items-center justify-center
      bg-white/[0.05] border border-white/[0.12]
      text-slate-500 text-sm
      hover:text-cyan-400 hover:border-cyan-400/30
      transition-all duration-150
    ">
      {/* BookmarkIcon */}
    </button>
    {/* repeat pattern for additional icon buttons */}
  </div>
</nav>
```

---

### 4.7 Item Detail View

The detail view is a **two-panel layout** — article content on the left, Knowledge Check quiz sidebar on the right. This replaces the single-column feed view when a card is opened. The quiz sidebar uses the same glass styling but is **not** a modal overlay in this context (see §4.5 for the modal overlay variant).

**Layout structure:**

```
<div>                            detail layout — 2-column grid
  <div>                          article panel (glass, ~62% width)
    <a>                          ← Back to feed link — text-slate-500, font-mono, hover:text-cyan-400
    <div>                        topic tag + date row
    <h1>                         article title — text-2xl font-bold text-slate-100
    <div>                        metadata grid (source / published / read time / type)
    <hr>                         divider — border-white/[0.08]
    <section>                    "Why It Matters" — text-slate-400
    <section>                    "Summary" — text-slate-400
    <section>                    "Key Concepts" — pill chips, violet accent
    <hr>
    <a>                          → Read full paper — text-cyan-400, font-mono
  <div>                          quiz sidebar (glass, ~380px fixed width)
    (see quiz sidebar spec below)
```

**Exact Tailwind classes:**

```jsx
{/* Detail page layout */}
<div className="grid grid-cols-[1fr_380px] gap-6">

  {/* Article panel */}
  <div className="
    relative overflow-hidden
    bg-white/[0.06] backdrop-blur-xl
    border border-white/[0.12]
    rounded-2xl p-8
    before:absolute before:top-0 before:inset-x-0 before:h-px
    before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
  ">
    {/* Back link */}
    <a className="flex items-center gap-2 text-xs text-slate-500 font-mono hover:text-cyan-400 transition-colors mb-6">
      ← Back to feed
    </a>

    {/* Topic + date row */}
    <div className="flex items-center gap-3 mb-4">
      <span className="inline-block font-mono text-[11px] font-semibold tracking-widest uppercase
                       px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
        Research Paper
      </span>
      <span className="text-xs text-slate-500 font-mono">arxiv · Feb 2026</span>
    </div>

    {/* Title */}
    <h1 className="text-2xl font-bold leading-snug text-slate-100 mb-4">
      Article title here
    </h1>

    {/* Metadata grid */}
    <div className="flex gap-10 mb-6">
      {[{key:'Source',val:'anthropic.com'},{key:'Published',val:'Mar 2026'},
        {key:'Read time',val:'~8 min'},{key:'Type',val:'Research paper'}].map(m => (
        <div key={m.key} className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.08em] text-slate-500 font-mono">{m.key}</span>
          <span className="text-[13px] text-slate-400">{m.val}</span>
        </div>
      ))}
    </div>

    <hr className="border-white/[0.08] my-5" />

    {/* Why It Matters */}
    <h2 className="text-[11px] font-mono font-semibold tracking-[0.08em] uppercase text-slate-500 mb-3">
      Why It Matters
    </h2>
    <p className="text-sm leading-[1.8] text-slate-400 mb-4">…</p>

    {/* Key Concepts chips */}
    <h2 className="text-[11px] font-mono font-semibold tracking-[0.08em] uppercase text-slate-500 mb-3 mt-6">
      Key Concepts
    </h2>
    <div className="flex flex-wrap gap-2 mb-6">
      <span className="text-[11px] px-3 py-1 rounded-full
                       bg-violet-500/10 border border-violet-500/22 text-violet-400">
        Constitutional AI
      </span>
      {/* repeat for each concept */}
    </div>

    <hr className="border-white/[0.08] my-5" />
    <a className="flex items-center gap-2 text-[13px] text-cyan-400 font-mono hover:underline">
      → Read full paper
    </a>
  </div>

  {/* Quiz sidebar — inline (not modal) */}
  <div className="
    relative overflow-hidden
    bg-white/[0.06] backdrop-blur-xl
    border border-white/[0.12]
    rounded-2xl p-6
    h-fit
    before:absolute before:top-0 before:inset-x-0 before:h-px
    before:bg-gradient-to-r before:from-transparent before:via-cyan-400/20 before:to-transparent
  ">
    <p className="text-[10px] font-mono font-semibold tracking-widest uppercase text-cyan-400 mb-4">
      Knowledge Check
    </p>
    <h3 className="text-[15px] font-semibold text-slate-100 leading-snug mb-5">
      Question text here
    </h3>

    <div className="flex flex-col gap-2.5">
      {/* Option buttons — same spec as §4.5 */}
      {/* Correct: bg-emerald-500/15 border-emerald-500/35 text-emerald-400 */}
      {/* Wrong:   bg-rose-500/15 border-rose-500/35 text-rose-400 */}
    </div>

    {/* Result feedback box (shown after answer) */}
    <div className="mt-5 p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-emerald-400 mb-2">Correct!</p>
      <p className="text-xs text-slate-400 leading-[1.5]">Explanation text here.</p>
    </div>

    {/* Progress + next button */}
    <div className="mt-5 pt-4 border-t border-white/[0.06]">
      <p className="text-xs text-slate-500 font-mono mb-3">1 of 3 questions</p>
      <button className="w-full py-3 rounded-xl text-sm text-cyan-400
                         bg-cyan-500/10 border border-cyan-500/25
                         hover:bg-cyan-500/15 transition-all duration-150">
        Next question →
      </button>
    </div>
  </div>

</div>
```

**Key difference from §4.5:** The sidebar variant is inline in the page layout (`h-fit`, no overlay). The modal variant in §4.5 is used when opening a quiz from the feed card directly (no article panel open). Both share the same option button styles.

---

### 4.8 Mobile Tab Row

On screens ≤768px the 4-column grid is replaced by a **horizontal scrolling tab bar** that switches the visible topic column. Each tab uses the topic's accent color when active.

```jsx
{/* Mobile tab row — replaces grid grid-cols-4 at ≤768px */}
<div className="
  flex gap-1 overflow-x-auto
  bg-[#0d1526]/90 backdrop-blur-md
  border border-white/[0.12]
  rounded-[14px] p-1.5
  md:hidden
">
  {/* Active tab */}
  <button className="
    flex-shrink-0 px-4 py-2 rounded-[10px]
    bg-violet-500/18 text-violet-400
    border border-violet-500/28
    text-sm font-medium
    whitespace-nowrap
  ">Engineering</button>

  {/* Inactive tab */}
  <button className="
    flex-shrink-0 px-4 py-2 rounded-[10px]
    text-slate-500 text-sm font-medium
    whitespace-nowrap
    hover:text-slate-200 hover:bg-white/[0.05]
    transition-all duration-150
  ">Research</button>
</div>
```

**Rule:** Active tab always uses the selected topic's accent color (not always violet). Swap `violet-500` for the appropriate accent when a different column is active.

---

## 5. Interaction & Motion Rules

| Interaction | Transition | Value |
|-------------|------------|-------|
| Card hover lift | `transition-all duration-200` | `hover:-translate-y-0.5` |
| Card hover border | `transition-all duration-200` | `border-white/[0.20]` |
| Card hover fill | `transition-all duration-200` | `bg-white/[0.10]` |
| Filter chip toggle | `transition-all duration-200` | Color swap, no layout shift |
| Search input focus | `transition-colors duration-200` | Border → `border-cyan-400/50` |
| Option button hover | `transition-all duration-150` | `bg-white/[0.10] border-white/[0.20]` |
| Wrong answer | `animate-shake` | 0.3s ease-in-out, ±4px X |
| Reference card hover | `transition-all duration-200` | `translateY(-2px)`, border → accent |

**General rule:** All transitions use `duration-150` to `duration-200`. No animations longer than 300ms in the base feed. Motion should feel instant but not jarring.

---

## 6. Tailwind Config Extension

Add to `tailwind.config.js` `extend` block:

```js
extend: {
  colors: {
    glass: {
      bg:     'rgba(255,255,255,0.06)',
      hover:  'rgba(255,255,255,0.10)',
      border: 'rgba(255,255,255,0.12)',
    },
    accent: {
      violet:  '#a78bfa',
      cyan:    '#22d3ee',
      emerald: '#34d399',
      amber:   '#fbbf24',
    },
    surface: {
      deep:   '#060a14',
      base:   '#0d1526',
      raised: '#121f38',
    },
  },
  backdropBlur: {
    glass: '20px',
  },
  boxShadow: {
    glass: '0 8px 32px 0 rgba(0,0,0,0.36)',
    glow:  '0 0 20px rgba(167,139,250,0.25)',
  },
  keyframes: {
    shake: {
      '0%, 100%': { transform: 'translateX(0)' },
      '25%':      { transform: 'translateX(-4px)' },
      '75%':      { transform: 'translateX(4px)' },
    },
  },
  animation: {
    shake: 'shake 0.3s ease-in-out',
  },
},
```

---

## 7. Constraints & Anti-Patterns

### Must-Follow Rules

- **Tailwind CSS only** — no custom `.css` files, no `styled-components`, no `style={{}}` for design values (only for genuinely dynamic values like computed widths)
- **No external component libraries** — no shadcn, no MUI, no Chakra
- **Dark-only** — AINews has no light mode; no `dark:` variant needed, no theme toggle
- **Always add ambient orbs** — glass panels are invisible on a plain dark background; the gradient orbs are what give them something to refract
- **Backdrop-filter fallback** — always pair `backdrop-blur-xl` with `@supports not (backdrop-filter: blur(1px)) { bg-slate-900/90 }` for non-supporting browsers

### Anti-Pattern Table

| ❌ Don't | ✅ Do instead |
|----------|--------------|
| White or light backgrounds anywhere | Deep navy `#060a14` always |
| Glass panels on a plain dark surface (no orbs) | Always place ambient gradient orbs behind glass |
| Dark text on glass panels | `text-slate-100` or `text-white` always |
| Multiple accent colors on one card | One accent per topic column, applied consistently |
| `backdrop-blur` without a fallback | Pair with `bg-slate-900/90` via `@supports` |
| Custom CSS files | Tailwind utility classes only |
| Using Inter/Roboto for all text | Monospace (`font-mono`) for labels, tags, metadata |
| Glassmorphism on every element | Reserve for: cards, search bar, topic headers, modal |
| Generic purple gradient on white | The "AI slop" aesthetic — explicitly banned |
| `line-clamp` missing on card text | Always `line-clamp-2` (title) and `line-clamp-3` (summary) |

---

## 8. Design Rationale

**Why dark glassmorphism?** The target user is a developer or technical professional who reads code all day. Dark, low-contrast-in-margins backgrounds reduce eye strain. The glassmorphism aesthetic signals premium quality and AI-nativeness — it's the dominant visual language of high-end fintech and AI dashboards in 2025–2026 (Robinhood, Apple Liquid Glass, Linear). It also communicates that this is a curated, deliberate product — not a scraped RSS feed.

**Why four fixed accent colors?** Cognitive load reduction. The user needs to instantly identify which topic column a card belongs to without reading the label. Violet / Cyan / Emerald / Amber are maximally distinct in both hue and perceptual brightness, remain legible against dark glass, and never feel muddy when used as low-opacity fills.

**Why monospace for labels?** Monospace communicates precision, data, and code — the vocabulary of the audience. It distinguishes metadata from body text without needing size changes, which preserves visual hierarchy while adding density.

**Why top shimmer lines?** A single 1px gradient (`via-white/20`) at the top of every glass card simulates light catching the edge of a physical glass panel. It's the one detail that most elevates flat dark rectangles into floating surfaces. It costs one `before:` pseudo-element and has zero layout impact.

---

## 9. Design Screenshots

Visual reference renders for each section — located in `docs/design-screenshots/`:

| File | Contents |
|------|----------|
| `01-home-feed.png` | Home feed — full 4-column dashboard with nav, search, filter chips, and populated cards |
| `02-card-style.png` | Card style — default / hover / bookmarked states and all 4 topic accent variants |
| `03-item-detail.png` | Item detail — article panel + inline Knowledge Check quiz sidebar |
| `04-typography-colors.png` | Typography & colors — accent palette, background system, text hierarchy, type scale, glass tokens |
| `05-nav-headers.png` | Nav & headers — app nav bar, column headers, mobile tab row, search + filter strip |

Legacy renders (pre-redesign, kept for reference):

| File | Contents |
|------|----------|
| `01-dashboard-layout.png` | Original dashboard layout render |
| `02-card-anatomy.png` | Original card anatomy render |
| `03-search-filter.png` | Original search + filter render |
| `05-modal-quiz.png` | Original quiz modal render |
| `06-column-headers.png` | Original column headers render |

---

*Generated: March 2026 — AINews UX Design Session*
*Updated: March 2026 — aligned with final HTML kit; screenshots moved to `docs/design-screenshots/`*
*Source: `docs/ainews-ux-design-kit.html`*
