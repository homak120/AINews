# Quickstart: AINews Knowledge Hub

**Branch**: `001-ainews-knowledge-hub` | **Date**: 2026-03-28

## Prerequisites

- Node.js 20+
- npm 9+

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Generate Content

Content is generated via a **Claude Code scheduled trigger** (cron job) that
uses web search to discover the past 7 days of AI news and writes a structured
`public/data/news.json`. No API key is needed — it runs under your Claude Pro
plan.

To generate content manually during development, run the Claude Code trigger
or ask Claude Code directly to research and produce the JSON.

The output is a human-readable `public/data/news.json`. Review and optionally
edit it before deploying.

---

## 3. Start Development Server

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## 4. Build for Production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

---

## 5. Deploy (Self-Hosted)

Copy the `dist/` folder to your server or VPS and serve with any static file
server (nginx, Caddy, serve, etc.).

```bash
# Example with 'serve'
npx serve dist
```

---

## 6. Deploy to Vercel (Phase 2)

```bash
npx vercel
```

---

## Weekly Content Refresh Workflow

1. Claude Code scheduled trigger generates a new `public/data/news.json`
   (or run manually via Claude Code)
2. Review the output — edit any items if needed
3. `git add public/data/news.json && git commit -m "chore: weekly content refresh"`
4. Redeploy (`npm run build` + copy to server, or `npx vercel`)

---

## Environment Variables

The web app requires no environment variables in Phase 1.
