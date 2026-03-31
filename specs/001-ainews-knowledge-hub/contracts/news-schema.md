# Contract: news.json Schema

**Version**: 1.1.0 | **Date**: 2026-03-30
**Status**: Active — Phase 1 contract.

## Overview

`public/data/news.json` is the sole data contract between the content generation
process (Claude Code trigger) and the web application. The trigger MUST produce
valid output conforming to this schema. The app MUST treat any deviation as an
error condition.

**Companion document**: [`content-generation-prompt.md`](content-generation-prompt.md)
— the prompt template that produces content conforming to this schema.

---

## Root Object

```json
{
  "generatedAt": "2026-03-28T10:00:00Z",
  "weekOf": "2026-03-22",
  "coverageStart": "2026-03-02",
  "coverageEnd": "2026-03-29",
  "items": [ ...NewsItem ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `generatedAt` | ISO 8601 string | ✅ | Timestamp of the most recent content generation |
| `weekOf` | ISO 8601 date | ✅ | Start date of the most recent 7-day content window |
| `coverageStart` | ISO 8601 date | ✅ | Earliest `publishedAt` date covered in the file |
| `coverageEnd` | ISO 8601 date | ✅ | Latest `publishedAt` date covered in the file |
| `items` | `NewsItem[]` | ✅ | All curated news items across the coverage period |

---

## NewsItem Object

```json
{
  "id": "youtube-dQw4w9WgXcQ",
  "topics": ["ai-engineering"],
  "type": "video",
  "title": "How AI Coding Assistants Are Changing Software Development",
  "sourceUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "youtubeId": "dQw4w9WgXcQ",
  "publishedAt": "2026-03-25",
  "summary": "This video explores how tools like GitHub Copilot and Claude Code are reshaping the day-to-day workflow of software engineers. It covers productivity gains, new debugging patterns, and the shift toward prompt-driven development.",
  "keyConcepts": [
    "Agentic coding workflows",
    "Prompt engineering for developers",
    "Code review with AI assistance"
  ],
  "whyItMatters": "AI coding assistants are becoming a default part of the software engineer's toolkit — understanding their capabilities and limits is now a core professional skill.",
  "tags": ["copilot", "claude-code", "agentic", "productivity"],
  "relatedIds": ["arxiv-2403-12345", "article-verge-ai-coding"],
  "knowledgeChecks": [
    {
      "question": "What is the primary benefit of agentic coding workflows described in the video?",
      "options": [
        "Eliminating the need for code review",
        "Automating multi-step tasks with minimal human intervention",
        "Replacing all junior developers",
        "Generating tests automatically"
      ],
      "correctIndex": 1,
      "explanation": "Agentic workflows allow AI to autonomously complete multi-step tasks (like writing, running, and fixing tests) rather than just completing single lines of code."
    }
  ]
}
```

### Field Definitions

| Field | Type | Required | Constraints |
|---|---|---|---|
| `id` | string | ✅ | URL-derived slug; unique within file; format: `{type}-{identifier}` |
| `topics` | `Topic[]` | ✅ | Min 1 entry; values from allowed Topic enum |
| `type` | `ContentType` | ✅ | One of: `video`, `article`, `paper`, `social` |
| `title` | string | ✅ | Non-empty; max 200 chars recommended |
| `sourceUrl` | string | ✅ | Valid URL to original content |
| `youtubeId` | string | ❌ | Present only when `type === "video"`; 11-char YouTube video ID |
| `publishedAt` | string | ✅ | ISO 8601 date (`YYYY-MM-DD`); within the `coverageStart`–`coverageEnd` window |
| `summary` | string | ✅ | 2-4 sentences; non-empty |
| `keyConcepts` | string[] | ✅ | 3-5 entries; non-empty strings |
| `whyItMatters` | string | ✅ | 1-2 sentences; non-empty |
| `tags` | string[] | ✅ | May be empty array `[]`; lowercase kebab-case recommended |
| `relatedIds` | string[] | ✅ | May be empty array `[]`; each ID MUST exist in `items` |
| `knowledgeChecks` | `KnowledgeCheck[]` | ✅ | May be empty array `[]`; 2-3 entries recommended |

### Allowed Topic Values

```
"ai-engineering"
"ai-research"
"ai-career"
"ai-industry"
```

### Allowed ContentType Values

```
"video"    → YouTube video (youtubeId required)
"article"  → Blog post, news article
"paper"    → Academic/research paper (e.g., arXiv)
"social"   → X/social post from a key AI figure
```

---

## KnowledgeCheck Object

| Field | Type | Required | Constraints |
|---|---|---|---|
| `question` | string | ✅ | Non-empty |
| `options` | string[] | ✅ | 3-4 entries |
| `correctIndex` | number | ✅ | Valid 0-based index into `options` |
| `explanation` | string | ✅ | Non-empty; shown after any answer attempt |

---

## ID Format Convention

| Content Type | ID Format | Example |
|---|---|---|
| YouTube video | `youtube-{videoId}` | `youtube-dQw4w9WgXcQ` |
| Article | `article-{domain}-{slug}` | `article-techcrunch-openai-gpt5` |
| arXiv paper | `arxiv-{YYMM}-{number}` | `arxiv-2403-12345` |
| Social post | `social-{platform}-{handle}-{date}` | `social-x-karpathy-20260325` |

---

## Breaking Change Policy

Any modification to this schema (adding required fields, changing types,
renaming fields) MUST:

1. Update this contract document with a new version number
2. Update `data-model.md` TypeScript interfaces
3. Update the Claude Code trigger prompt to produce the new schema
4. Update all app consumers of the affected fields

Additive optional fields (adding a new optional field) are non-breaking.
