# Quickstart: AINews Knowledge Hub

**Branch**: `001-ainews-knowledge-hub` | **Date**: 2026-03-28

## Prerequisites

- Node.js 20+
- npm 9+
- An Anthropic API key (for the seed script only)

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Generate Content (Seed Script)

The seed script uses Claude with web search to generate `data/news.json`
covering the past 7 days. Run it before starting the app for the first time,
and each week to refresh content.

```bash
ANTHROPIC_API_KEY=your_key_here npm run seed
```

The script outputs a draft `data/news.json`. Review and optionally edit it
before proceeding. The file is human-readable JSON.

---

## 3. Start Development Server

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## 4. Run Tests

```bash
npm run test          # run all tests
npm run test:watch    # watch mode
```

---

## 5. Build for Production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

---

## 6. Deploy (Self-Hosted)

Copy the `dist/` folder to your server or VPS and serve with any static file
server (nginx, Caddy, serve, etc.).

```bash
# Example with 'serve'
npx serve dist
```

---

## 7. Deploy to Vercel (Phase 2)

```bash
npx vercel
```

Set `ANTHROPIC_API_KEY` as an environment variable in the Vercel dashboard
(only needed if running the seed script from Vercel — not required for the
static app itself).

---

## Weekly Content Refresh Workflow

1. Run `npm run seed` to generate a new `data/news.json`
2. Review the output — edit any items if needed
3. `git add data/news.json && git commit -m "chore: weekly content refresh"`
4. Redeploy (`npm run build` + copy to server, or `npx vercel`)

---

## Environment Variables

| Variable | Required | Used By |
|---|---|---|
| `ANTHROPIC_API_KEY` | Seed script only | `npm run seed` |

The web app itself requires no environment variables in Phase 1.
