# AINews

A personal AI knowledge hub that replaces scattered YouTube searches, article browsing, and LLM queries with a single, organized weekly digest — framed around learning rather than just consuming news.

## The Problem

Staying current on AI means juggling:
- Searching YouTube for relevant videos manually
- Browsing news sites and blogs with no structure
- Reading research papers discovered by chance
- Asking LLMs with web search for summaries

There is no single place that curates AI content with an **educational focus**, organized by topic, and presented in an interactive format.

## What AINews Does

AINews aggregates content from multiple sources (YouTube, articles, arXiv papers, X/social posts from key AI figures) and presents each item as a structured learning card — not just a link, but a full breakdown:

- **Summary** — what it covers
- **Key concepts** — the ideas worth understanding
- **Why it matters** — the broader significance
- **Embedded video** (where applicable)
- **Related content** — suggested next steps

Content is organized by topic and refreshed weekly.

## Topic Areas

| Topic | Coverage |
|---|---|
| **AI Engineering & Skill Development** | AI coding assistants, agentic workflows, tutorials, system design, dev tools |
| **AI Research & Future Technology** | Research papers, model breakthroughs, multimodal systems, next-gen AI |
| **AI Career & Workforce Intelligence** | Job market shifts, hiring trends, skill requirements, workforce automation |
| **AI Industry Strategy & Product Landscape** | Product launches, startup funding, Big Tech strategy, market competition |

## Interactive Features

- **Bookmarks** — save items to revisit later
- **Notes & Annotations** — add personal notes to any item
- **Knowledge Checks** — 2-3 questions after consuming an item to reinforce learning
- **Related Content** — curated suggestions to go deeper on any topic

## Tech Stack

| Concern | Choice |
|---|---|
| Language | TypeScript (strict) |
| UI Framework | React 18+ |
| Routing | React Router v6+ |
| Styling | Tailwind CSS |
| State | useState / useReducer / Context API |
| Persistence | localStorage |
| HTTP Client | Axios |

## Phased Delivery

### Phase 0 — Data Seed
A Claude Code scheduled trigger (cron job) uses web search to discover the
past 7 days of AI content and generates a structured `public/data/news.json`
file. No API key needed — runs under the Claude Pro plan.

### Phase 1 — MVP (current)
Web app reads from the static `data/news.json`. Full interactive UI with all
features above. Weekly refresh = Claude Code trigger generates new content,
operator reviews and redeploys. Self-hosted deployment.

### Phase 2 — Live Pipeline
Fully automated weekly refresh via Claude Code scheduled triggers. Migrate to
Vercel.

## Who It's For

Primarily a personal tool, with the option to share with a small group of friends. No heavy authentication — access control handled at the deployment level.
