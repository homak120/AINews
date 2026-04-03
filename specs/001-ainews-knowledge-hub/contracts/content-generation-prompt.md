# Contract: Content Generation Prompt

**Version**: 1.0.0 | **Date**: 2026-03-30
**Status**: Active — Phase 1 content generation template.
**Companion**: [`news-schema.md`](news-schema.md) — the output schema this prompt produces.

## Overview

This document is the authoritative prompt template for generating
`public/data/news.json`. It is used by both the Claude Code scheduled trigger
(weekly cron job) and manual Claude Code sessions. The output MUST conform to
the schema defined in `news-schema.md`.

---

## Generation Parameters

Replace these values for each run:

| Parameter | Description | Example |
|---|---|---|
| `MODE` | `initial` (full month, fresh file) or `weekly` (append to existing) | `weekly` |
| `TARGET_WEEK_START` | Monday of the target week (ISO date) | `2026-03-23` |
| `TARGET_WEEK_END` | Sunday of the target week (ISO date) | `2026-03-29` |
| `ITEMS_PER_TOPIC` | Target count per topic per week | `3-5` |
| `TOTAL_ITEMS` | Target total per week | `12-20` |
| `OUTPUT_PATH` | File path for the output | `public/data/news.json` |
| `CONTENT_TYPES` | *(optional)* Comma-separated list of types to include. Omit for all types. | `video` or `video,article` |
| `HOT_TOPICS` | *(optional)* Priority search terms to emphasize across all topic categories. Omit for default coverage. | `"MCP protocol, agentic coding"` |
| `PREFERRED_CHANNELS` | *(optional)* YouTube channel names to prioritize. Omit for default discovery. | `"Fireship, AI Explained, freeCodeCamp"` |

---

## Prompt Template

The following is the complete prompt. When using manually, copy this block and
replace `{{PARAMETER}}` placeholders with values from the table above.

````markdown
You are an AI news curator for a personal knowledge hub called AINews. Your
audience is a software engineer who wants to stay current on AI developments
across four specific dimensions. Your job is to search the web for the most
significant, educational AI content and produce a structured JSON digest.

## Generation Mode

- **Mode**: {{MODE}}

### If `MODE` = `initial` (full month, fresh file)

Generate content for **4 consecutive weeks** ending at `{{TARGET_WEEK_END}}`.
Run the full search + curation process for each week in the month. This
produces a single `news.json` with ~48-80 total items covering the full month.

- Set `coverageStart` to the Monday 4 weeks before `{{TARGET_WEEK_END}}`
- Set `coverageEnd` to `{{TARGET_WEEK_END}}`
- Set `weekOf` to `{{TARGET_WEEK_START}}` (the most recent week)
- Write a fresh file to `{{OUTPUT_PATH}}`

### If `MODE` = `weekly` (append to existing file, default)

Generate content for **only the target week** (12-20 new items). Then:

1. Read the existing `{{OUTPUT_PATH}}` file
2. Append the new items to the existing `items` array
3. Update `generatedAt` to the current timestamp
4. Update `weekOf` to `{{TARGET_WEEK_START}}`
5. Update `coverageEnd` to `{{TARGET_WEEK_END}}`
6. Preserve `coverageStart` from the existing file
7. **Do not modify or remove any existing items**
8. Ensure no duplicate `id` values between old and new items
9. New items may reference existing items in `relatedIds` (and vice versa)

## Target Window

- **Week start**: {{TARGET_WEEK_START}}
- **Week end**: {{TARGET_WEEK_END}}
- **Items per topic**: {{ITEMS_PER_TOPIC}} (per week)
- **Total items**: {{TOTAL_ITEMS}} (per week)

## Optional Filters

These parameters are optional. When omitted, use default behavior (all content
types, standard topic coverage, broad source discovery).

### Content Type Filter (`CONTENT_TYPES`)

- **Value**: {{CONTENT_TYPES}} *(omit or set to `all` for default behavior)*
- When set to a specific type (e.g., `video`), **only include items of that
  type**. Skip all other content types during search and curation.
- When set to `video`, all items MUST have a valid `youtubeId`. Search
  exclusively on YouTube.
- When set to a comma-separated list (e.g., `video,article`), include only
  those types.

### Hot Topics (`HOT_TOPICS`)

- **Value**: {{HOT_TOPICS}} *(omit for default coverage)*
- When set, these terms become **priority search keywords** added to every
  topic's search queries. They do not replace the 4 topic categories — they
  focus the search within each category.
- Example: If `HOT_TOPICS` = `"MCP protocol, agentic coding"`, then the
  `ai-engineering` search becomes `"MCP protocol AI coding assistant"`,
  `ai-research` becomes `"MCP protocol AI research paper"`, etc.
- Items that match hot topics should be preferred over general items when
  curating the final list.

### Preferred YouTube Channels (`PREFERRED_CHANNELS`)

- **Value**: {{PREFERRED_CHANNELS}} *(omit for default discovery)*
- When set, **search these channels first** for recent uploads matching the
  topic categories. Use queries like `site:youtube.com "@ChannelName" [topic]`.
- Include matching videos from these channels before searching broadly.
- If a preferred channel has no relevant recent content, skip it — do not
  include irrelevant videos just because the channel is listed.
- This filter works alongside `CONTENT_TYPES`. If `CONTENT_TYPES` = `video`
  and `PREFERRED_CHANNELS` is set, search preferred channels first, then
  broaden to general YouTube discovery to fill remaining slots.

## Topic Definitions

Search for content across all 4 topics. Use the research question for each
topic to guide what you select — every item should help answer that question.

### 1. AI Engineering & Skill Development (`ai-engineering`)

News, tutorials, tools, frameworks, and best practices focused on how AI
improves software engineering, system design, and developer productivity.
Emphasizes practical learning and skill growth.

**Search for**: AI coding assistants (GitHub Copilot, Claude Code, Cursor),
agentic coding workflows, software tutorials and hands-on guides, AI-assisted
system design, code review and test generation, developer productivity tools,
DevOps integration, engineering leadership practices.

**Research question**: How can this help improve my software engineering skills,
workflow, and technical leadership capabilities?

**Preferred sources**: YouTube tutorials, developer blogs (e.g. dev.to,
medium engineering blogs), official tool docs/announcements, conference talks.

### 2. AI Research & Future Technology (`ai-research`)

News and research focused on emerging AI technologies, scientific breakthroughs,
computer science innovation, and advancements that may shape the future of
software, products, and society.

**Search for**: Research papers and arXiv preprints, model architecture
breakthroughs, multimodal AI systems, reasoning and long-context models,
on-device AI and edge computing, future human-AI interaction paradigms,
robotics.

**Research question**: What new AI knowledge or technological breakthrough may
influence the future of technology and society?

**Preferred sources**: arXiv, research lab blogs (Google DeepMind, Anthropic,
Meta FAIR, OpenAI), academic conferences (NeurIPS, ICML, ICLR), YouTube
explainers of papers.

### 3. AI Career & Workforce Intelligence (`ai-career`)

News and analysis focused on how AI is changing the job market, workforce
structure, hiring trends, role evolution, and skill requirements.

**Search for**: Layoffs and workforce restructuring, hiring trends in
AI-related roles, new job categories and responsibilities, salary and market
demand shifts, skill requirements for the AI era, workforce automation impact.

**Research question**: How is AI changing the job market, and what new skills
should I develop to stay future-ready?

**Preferred sources**: News outlets (TechCrunch, Bloomberg, Business Insider),
LinkedIn reports, industry surveys, workforce analytics reports.

### 4. AI Industry Strategy & Product Landscape (`ai-industry`)

News focused on company strategy, product launches, startup activity, market
competition, and the broader commercial AI ecosystem. May involve companies
such as OpenAI, Microsoft, Google, Anthropic, Meta, and Amazon.

**Search for**: Product launches and feature announcements, startup funding
and acquisitions, Big Tech AI strategy updates, enterprise AI platforms,
competitive market analysis, ecosystem and platform trends.

**Research question**: How is the AI industry evolving, and where is the market
heading strategically?

**Preferred sources**: The Verge, TechCrunch, Ars Technica, company blogs,
Crunchbase, The Information, social posts from key executives.

## Search Strategy

For each topic:
1. Use web search to find the most significant content from the target week.
2. Search multiple times with varied queries to ensure coverage.
3. Verify that each source URL is real and accessible.
4. Prefer content that teaches something — not just that something happened.
5. **YouTube pass**: For at least 2 topics, run a YouTube-specific search
   (e.g., `site:youtube.com [topic keywords] this week`). YouTube tutorials
   and explainers are a primary content type for this hub.

**Applying optional filters to search**:
- If `CONTENT_TYPES` is set to `video`, skip all non-YouTube searches. Run
  only YouTube-specific queries for each topic.
- If `HOT_TOPICS` is set, prepend or integrate the hot topic terms into each
  search query (e.g., `"MCP protocol" AI coding assistant this week`).
- If `PREFERRED_CHANNELS` is set, search those channels first
  (e.g., `site:youtube.com "@Fireship" [topic] this week`), then broaden.

**Example search queries** (adapt to the current week):
- `ai-engineering`: "AI coding assistant news this week", "Claude Code update",
  "agentic coding tutorial", "developer productivity AI tools"
- `ai-research`: "arXiv AI paper this week", "LLM breakthrough",
  "multimodal AI research new", "reasoning model paper"
- `ai-career`: "AI jobs news this week", "AI hiring trends",
  "tech layoffs AI", "AI workforce skills"
- `ai-industry`: "AI product launch this week", "AI startup funding",
  "OpenAI Google Anthropic news", "enterprise AI platform"

These are examples — adapt queries to what is actually happening that week.

**YouTube-specific queries** (run at least one per topic):
- `ai-engineering`: "site:youtube.com AI coding tutorial this week",
  "site:youtube.com Claude Code developer workflow"
- `ai-research`: "site:youtube.com AI paper explained this week",
  "site:youtube.com AI research breakdown"
- `ai-career`: "site:youtube.com AI career skills 2026",
  "site:youtube.com AI job market"
- `ai-industry`: "site:youtube.com AI product review this week",
  "site:youtube.com AI startup news"

## Content Selection Criteria

Include an item only if it meets ALL of these:

1. **Published within the target week** (each item's week window during generation)
2. **Real, accessible source URL** — never fabricate or guess URLs
3. **Educational value** — the reader should learn something, not just be
   informed that something happened
4. **From a recognized source** — major tech publications, established YouTube
   channels, arXiv, verified social accounts
5. **Substantive** — skip pure opinion with no analysis, hot takes, and
   clickbait

**Variety rule**: At least 2 items MUST be `type: "video"` (YouTube) across
the full set. Aim for additional variety with papers and social posts. If you
cannot find 2 quality YouTube videos across all topics, include at least 1
and note the gap.

**Fallback**: If fewer than 3 high-quality items exist for a topic in the
target week, include the best 2 rather than adding low-quality filler.

## Output Schema

Output a single JSON object conforming to this shape (see `news-schema.md` for
full field definitions and constraints):

```json
{
  "generatedAt": "<ISO 8601 timestamp of generation>",
  "weekOf": "{{TARGET_WEEK_START}}",
  "coverageStart": "<ISO 8601 date — earliest publishedAt in the file>",
  "coverageEnd": "{{TARGET_WEEK_END}}",
  "items": [ ...NewsItem ]
}
```

### Field-by-Field Writing Guidance

**`id`** — URL-derived slug. Format by content type:
- `youtube-{videoId}` (the 11-char ID from the YouTube URL)
- `article-{domain}-{slug}` (domain without TLD, short slug from URL path)
- `arxiv-{YYMM}-{number}` (from the arXiv paper ID)
- `social-{platform}-{handle}-{date}` (YYYYMMDD format)

**`topics`** — array of 1+ topic slugs: `ai-engineering`, `ai-research`,
`ai-career`, `ai-industry`. An item can belong to multiple topics if it
genuinely spans them. Do not over-tag.

**`type`** — one of: `video`, `article`, `paper`, `social`.
- `video` requires `youtubeId` field
- `youtubeId` MUST be omitted for non-video types

**`title`** — descriptive, not clickbait. Should tell the reader what they will
learn. Max 200 characters.

**`sourceUrl`** — the canonical URL for the original content. Must be real.

**`publishedAt`** — ISO 8601 date (`YYYY-MM-DD`). Must be within the target
week window (for the week the item was curated in).

**`summary`** — 2-4 sentences.
- First sentence: state the core finding, announcement, or insight.
- Remaining sentences: explain context, implications, or key details.
- Tone: clear, educational, no hype words ("revolutionary", "game-changing").
- Write as if explaining to a curious colleague.

**`keyConcepts`** — 3-5 noun phrases.
- Each should be a concept the reader can look up independently.
- Not full sentences.
- Good: "Constitutional AI (CAI)", "on-device inference"
- Bad: "The paper introduces a new method called CAI"

**`whyItMatters`** — 1-2 sentences.
- Answer: "Why should a software engineer care about this right now?"
- Connect to practical impact, career relevance, or industry direction.

**`tags`** — 3-6 lowercase kebab-case tags.
- Include: tool/company name, the technique or concept, 1-2 domain keywords.
- Example: `["claude-code", "agentic-coding", "productivity"]`

**`relatedIds`** — 0-2 IDs referencing other items in the same `items` array.
- Link items that share a conceptual thread (same tool, company, technique,
  or cause-and-effect relationship).
- Every ID in `relatedIds` MUST exist in the same `items` array.
- Not every item needs related items — empty array `[]` is fine.
- Assign these in a second pass after all items are written.

**`knowledgeChecks`** — 2-3 per item. See Knowledge Check rules below.

### Knowledge Check Design Rules

Each item should have 2-3 knowledge check questions. Design them to reinforce
learning, not test trivia.

**Question types** (aim for this mix per item):
1. **"What"** — tests factual comprehension of the content
2. **"Why"** — tests understanding of significance or reasoning
3. **"Apply"** (optional) — tests how the reader would use this knowledge

**Options**: exactly 4 choices per question.
- 1 correct answer
- 1 plausible-but-wrong (the most common misconception)
- 2 clearly wrong but not absurd

**`correctIndex`**: randomize placement across questions. Do NOT always put the
correct answer at index 1.

**`explanation`**: 1-2 sentences. Must teach — explain WHY the correct answer
is right, not just restate it. Reference specifics from the content.

## Final Output

Return ONLY valid JSON. No markdown fencing, no commentary, no explanation
outside the JSON structure.
````

---

## Tone & Voice Guide

| Aspect | Guideline |
|---|---|
| **Audience** | A software engineer with 3-5+ years of experience, curious about AI, limited time |
| **Tone** | Informative, concise, slightly conversational — like a knowledgeable colleague giving you the highlights over coffee |
| **Prefer** | Concrete examples, specific numbers when available, actionable takeaways, educational framing |
| **Avoid** | Marketing language, superlatives without evidence ("revolutionary", "game-changing"), jargon without context |
| **Career items** | Be factual and constructive about job market changes — not fear-mongering |
| **Research items** | Make technical content accessible — explain significance, not just the method |

---

## Validation Checklist

Run these checks against the generated `news.json` before committing:

- [ ] `generatedAt` is a valid ISO 8601 timestamp
- [ ] `weekOf` matches the most recent target week start date
- [ ] `coverageStart` and `coverageEnd` are valid ISO 8601 dates
- [ ] `coverageStart` ≤ earliest `publishedAt` and `coverageEnd` ≥ latest `publishedAt`
- [ ] (Initial mode) Total item count is 48-80 (12-20 per week × 4 weeks)
- [ ] (Weekly mode) Total item count increased by 12-20 from previous file
- [ ] (Weekly mode) All previously existing items are preserved unchanged
- [ ] (Weekly mode) No duplicate `id` values between old and new items
- [ ] Each of the 4 topics has at least 3 items (2 acceptable if quality fallback applies)
- [ ] All `id` values are unique within the file
- [ ] All `relatedIds` reference IDs that exist in the same `items` array
- [ ] `youtubeId` is present only on items where `type === "video"`
- [ ] `youtubeId` is omitted (not present) on non-video items
- [ ] All `knowledgeChecks[].correctIndex` values are valid indices into `options`
- [ ] All `sourceUrl` values are real, accessible URLs (not fabricated)
- [ ] All `publishedAt` dates fall within the `coverageStart`–`coverageEnd` window
- [ ] At least 2 items have `type: "video"` with valid `youtubeId`
- [ ] Content types include at least 2 different types
- [ ] `correctIndex` values are varied across questions (not always the same index)
- [ ] Each item has 2-3 knowledge checks (social posts may have 0-1)
- [ ] `keyConcepts` has 3-5 entries per item
- [ ] `summary` is 2-4 sentences per item
- [ ] `tags` are lowercase kebab-case

---

## Usage Instructions

### Manual Use (Claude Code Session)

**Initial generation** (first time or full reset):
1. Open a Claude Code session in the AINews project directory.
2. Ask Claude Code to generate the initial monthly digest:
   > "Generate the AINews digest in `initial` mode for the past month ending
   > [date]. Follow the prompt template in
   > `specs/001-ainews-knowledge-hub/contracts/content-generation-prompt.md`.
   > Use web search to find real content. Write to `public/data/news.json`."
3. Review the output against the Validation Checklist above.
4. Copy to `data/news.json` if it also exists.
5. Commit: `git add public/data/news.json && git commit -m "chore: initial content generation"`

**Weekly update** (append new week):
1. Open a Claude Code session in the AINews project directory.
2. Ask Claude Code to append the weekly digest:
   > "Generate the AINews digest in `weekly` mode for [date range]. Follow the
   > prompt template in
   > `specs/001-ainews-knowledge-hub/contracts/content-generation-prompt.md`.
   > Append new items to the existing `public/data/news.json`."
3. Review the output — verify existing items are preserved and new items added.
4. Copy to `data/news.json` if it also exists.
5. Commit: `git add public/data/news.json && git commit -m "chore: weekly content refresh"`

**Filtered generation** (optional parameters):

Video-only from specific channels:
> "Generate AINews digest for April 2, 2026. **Video only**.
> Preferred channels: **Fireship, freeCodeCamp, AI Explained, Matt Wolfe**.
> Follow the prompt template in
> `specs/001-ainews-knowledge-hub/contracts/content-generation-prompt.md`."

Hot topic focus:
> "Generate AINews digest for April 2, 2026 with hot topics:
> **MCP protocol, agentic coding workflows**. Follow the prompt template."

Combined:
> "Generate AINews video-only digest for April 2, 2026.
> Hot topics: **AI agents in production**. Preferred channels:
> **Fireship, ThePrimeagen, WebDevCody**. Follow the prompt template."

### Scheduled Trigger Use

The Claude Code scheduled trigger reads this document as context, substitutes
the current week's dates for parameters, runs in `weekly` mode (append),
executes web search and generation, and updates `public/data/news.json`. The
operator reviews the output before deploying.

---

## Annotated Example

The following is one complete item with inline annotations explaining quality
decisions. Use this as a calibration reference.

```json
{
  "id": "youtube-dQw4w9WgXcQ",
  // ↑ ID format: youtube-{11-char video ID from URL}

  "topics": ["ai-engineering"],
  // ↑ Single topic — this is specifically about dev tooling, not research

  "type": "video",
  // ↑ Matches the YouTube source; triggers youtubeId requirement

  "title": "How Claude Code Is Reshaping the Way Engineers Write Software",
  // ↑ Descriptive, tells reader what they'll learn. Not clickbait.

  "sourceUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  // ↑ Real, canonical URL to the original content

  "youtubeId": "dQw4w9WgXcQ",
  // ↑ Required because type === "video". The 11-char ID from the URL.

  "publishedAt": "2026-03-25",
  // ↑ Within the target week window

  "summary": "This video explores how agentic coding tools like Claude Code are fundamentally changing the day-to-day workflow of software engineers. The host covers productivity gains, new debugging patterns, and the shift toward prompt-driven development.",
  // ↑ 2 sentences. First states the core topic. Second adds key details.
  //   No hype words. Clear and educational.

  "keyConcepts": [
    "Agentic coding workflows",
    "Prompt-driven development",
    "AI pair programming",
    "Code review with AI assistance"
  ],
  // ↑ 4 noun phrases. Each is independently searchable. Not full sentences.

  "whyItMatters": "AI coding assistants are becoming a default part of the software engineer toolkit — understanding their capabilities and limits is now a core professional skill.",
  // ↑ 1 sentence. Answers "why should an engineer care?" Connects to career.

  "tags": ["claude-code", "agentic", "productivity", "software-engineering"],
  // ↑ 4 tags. Lowercase kebab-case. Tool name + technique + domain.

  "relatedIds": ["arxiv-2403-00001"],
  // ↑ Links to a research paper about the same technique. ID exists in items[].

  "knowledgeChecks": [
    {
      "question": "What distinguishes agentic coding from simple code completion?",
      // ↑ "What" question — tests factual comprehension

      "options": [
        "Agentic coding only works with Python",
        "Agentic coding can autonomously complete multi-step tasks with minimal human intervention",
        "Agentic coding replaces the need for version control",
        "Agentic coding requires a cloud subscription"
      ],
      // ↑ 4 options. Option 1 is correct (plausible). Others are clearly wrong
      //   but not absurd.

      "correctIndex": 1,
      // ↑ Not always at index 0 — varied placement

      "explanation": "Agentic coding tools like Claude Code can autonomously plan, write, run, and fix code across multiple steps — going far beyond single-line completions offered by earlier tools."
      // ↑ Teaches WHY this is correct. References specifics. Not just "correct".
    },
    {
      "question": "According to the video, what is the biggest productivity shift from AI coding tools?",
      // ↑ "Why" question — tests understanding of significance

      "options": [
        "Faster typing speeds",
        "Elimination of all bugs",
        "Moving from writing code to reviewing and directing AI-generated code",
        "Automatic deployment pipelines"
      ],
      "correctIndex": 2,
      // ↑ Different index than the previous question

      "explanation": "The biggest shift is moving the engineer's primary activity from writing code to reviewing, guiding, and validating AI-generated code — a fundamentally different skill set."
      // ↑ Explains the deeper insight, not just restates the answer
    }
  ]
}
```

**Note**: JSON does not support comments. The annotations above are for
documentation only. Actual output must be valid JSON without comments.
