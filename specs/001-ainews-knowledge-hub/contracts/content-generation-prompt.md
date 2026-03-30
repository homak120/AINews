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
| `TARGET_WEEK_START` | Monday of the target week (ISO date) | `2026-03-23` |
| `TARGET_WEEK_END` | Sunday of the target week (ISO date) | `2026-03-29` |
| `ITEMS_PER_TOPIC` | Target count per topic | `3-5` |
| `TOTAL_ITEMS` | Target total across all topics | `12-20` |
| `OUTPUT_PATH` | File path for the output | `public/data/news.json` |

---

## Prompt Template

The following is the complete prompt. When using manually, copy this block and
replace `{{PARAMETER}}` placeholders with values from the table above.

````markdown
You are an AI news curator for a personal knowledge hub called AINews. Your
audience is a software engineer who wants to stay current on AI developments
across four specific dimensions. Your job is to search the web for the most
significant, educational AI content from the past week and produce a structured
JSON digest.

## Target Window

- **Week start**: {{TARGET_WEEK_START}}
- **Week end**: {{TARGET_WEEK_END}}
- **Items per topic**: {{ITEMS_PER_TOPIC}}
- **Total items**: {{TOTAL_ITEMS}}

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

## Content Selection Criteria

Include an item only if it meets ALL of these:

1. **Published within the target week** ({{TARGET_WEEK_START}} to {{TARGET_WEEK_END}})
2. **Real, accessible source URL** — never fabricate or guess URLs
3. **Educational value** — the reader should learn something, not just be
   informed that something happened
4. **From a recognized source** — major tech publications, established YouTube
   channels, arXiv, verified social accounts
5. **Substantive** — skip pure opinion with no analysis, hot takes, and
   clickbait

**Variety rule**: Aim for a mix of content types across the full set. Not all
items should be articles — include videos, papers, and social posts where
quality content exists.

**Fallback**: If fewer than 3 high-quality items exist for a topic in the
target week, include the best 2 rather than adding low-quality filler.

## Output Schema

Output a single JSON object conforming to this shape (see `news-schema.md` for
full field definitions and constraints):

```json
{
  "generatedAt": "<ISO 8601 timestamp of generation>",
  "weekOf": "{{TARGET_WEEK_START}}",
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
week window.

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
- [ ] `weekOf` matches the target week start date
- [ ] Total item count is 12-20
- [ ] Each of the 4 topics has at least 3 items (2 acceptable if quality fallback applies)
- [ ] All `id` values are unique within the file
- [ ] All `relatedIds` reference IDs that exist in the same `items` array
- [ ] `youtubeId` is present only on items where `type === "video"`
- [ ] `youtubeId` is omitted (not present) on non-video items
- [ ] All `knowledgeChecks[].correctIndex` values are valid indices into `options`
- [ ] All `sourceUrl` values are real, accessible URLs (not fabricated)
- [ ] All `publishedAt` dates fall within the target week window
- [ ] Content types are mixed (not all articles — at least 2 different types)
- [ ] `correctIndex` values are varied across questions (not always the same index)
- [ ] Each item has 2-3 knowledge checks (social posts may have 0-1)
- [ ] `keyConcepts` has 3-5 entries per item
- [ ] `summary` is 2-4 sentences per item
- [ ] `tags` are lowercase kebab-case

---

## Usage Instructions

### Manual Use (Claude Code Session)

1. Open a Claude Code session in the AINews project directory.
2. Ask Claude Code to generate the weekly news digest, referencing this document:
   > "Generate the weekly AINews digest for [date range] following the prompt
   > template in `specs/001-ainews-knowledge-hub/contracts/content-generation-prompt.md`.
   > Use web search to find real content. Write the output to `public/data/news.json`."
3. Review the output against the Validation Checklist above.
4. Optionally edit any items for accuracy or quality.
5. Copy to `data/news.json` if it also exists.
6. Commit: `git add public/data/news.json && git commit -m "chore: weekly content refresh"`

### Scheduled Trigger Use

The Claude Code scheduled trigger reads this document as context, substitutes
the current week's dates for parameters, executes web search and generation,
and writes to `public/data/news.json`. The operator reviews the output before
deploying.

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
