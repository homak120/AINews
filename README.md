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
| **AI in Software Engineering** | Copilots, agentic coding, LLM APIs, dev tooling |
| **AI Research & Computer Science** | New models, papers, benchmarks, breakthroughs |
| **AI & Job Market** | Hiring trends, in-demand skills, role disruption |
| **AI Products & Industry** | Product launches, funding, company moves |

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
A one-time research script pulls the last 7 days of AI content and generates a structured `data/news.json` file. This seeds the app with real content from day one without requiring a live data pipeline.

### Phase 1 — MVP (current)
Web app reads from the static `data/news.json`. Full interactive UI with all features above. Weekly refresh = re-run the seed script and redeploy. Self-hosted deployment.

### Phase 2 — Live Pipeline
Automated content fetching on a schedule. Migrate to Vercel. Real-time or daily refresh replaces the manual weekly script.

## Who It's For

Primarily a personal tool, with the option to share with a small group of friends. No heavy authentication — access control handled at the deployment level.
