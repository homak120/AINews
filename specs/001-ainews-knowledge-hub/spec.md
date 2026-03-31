# Feature Specification: AINews Knowledge Hub

**Feature Branch**: `001-ainews-knowledge-hub`
**Created**: 2026-03-28
**Status**: Draft
**Input**: Personal AI knowledge hub — curated weekly digest of AI news across
Software Engineering, Computer Science, Job Market, and Industry topics.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Curated AI News Feed (Priority: P1)

A user opens the app and immediately sees a curated list of AI news items from
the past week, organized by topic. Each item displays a headline, source type
badge, publication date, and a short teaser. The user can filter by topic to
narrow to their area of interest and click into any item for the full breakdown.

**Why this priority**: This is the entire reason the app exists — replacing
scattered YouTube searches and web browsing with one organized view. Without
this, nothing else is meaningful.

**Independent Test**: App loads with news items visible, topic filters work,
and clicking an item shows its full detail. Can be demonstrated with static
`news.json` alone.

**Acceptance Scenarios**:

1. **Given** the app is open, **When** the feed loads, **Then** at least one
   news item is visible per topic area with a title, source badge, and date.
2. **Given** multiple topics exist, **When** the user selects "AI Engineering & Skill Development", **Then** only items tagged to that topic are shown.
3. **Given** a news item in the feed, **When** the user clicks it, **Then** a
   detail view opens showing the full structured breakdown.
4. **Given** a video item, **When** the detail view opens, **Then** an embedded
   YouTube player is displayed inline without leaving the app.
5. **Given** the detail view, **When** the user reads it, **Then** they see:
   summary, key concepts list, and a "Why it matters" section.

---

### User Story 2 - Bookmark Items and Add Personal Notes (Priority: P2)

A user finds an interesting item and wants to save it for later or add their own
notes. They bookmark the item and type a note. When they return tomorrow, both
the bookmark and the note are still there.

**Why this priority**: The core learning loop requires the ability to capture
personal context. Without persistence, every session starts from scratch.

**Independent Test**: Bookmark an item, add a note, close and reopen the
browser — bookmark and note must still be present. Requires only the feed + a
single item detail page.

**Acceptance Scenarios**:

1. **Given** an item detail view, **When** the user clicks the bookmark icon,
   **Then** the item is marked as bookmarked and appears in the bookmarks list.
2. **Given** a bookmarked item, **When** the user clicks the bookmark icon
   again, **Then** the item is removed from bookmarks.
3. **Given** an item detail view, **When** the user types a note, **Then** the
   note is saved automatically without a manual save action.
4. **Given** saved bookmarks and notes, **When** the user closes and reopens
   the browser, **Then** all bookmarks and notes are intact.
5. **Given** the bookmarks view, **When** the user opens it, **Then** all
   bookmarked items are listed with their associated notes visible.

---

### User Story 3 - Test Understanding with Knowledge Checks (Priority: P3)

After watching a video or reading an item, the user can answer 2-3 questions to
test what they learned. They receive immediate feedback on each answer, with a
brief explanation of the correct answer.

**Why this priority**: Knowledge checks are the key differentiator from a plain
news aggregator — they make the app an active learning tool rather than passive
reading.

**Independent Test**: Open any item with knowledge check questions, attempt
answers, see feedback. Works independently of bookmarks or related content.

**Acceptance Scenarios**:

1. **Given** an item with knowledge check questions, **When** the user scrolls
   to the knowledge check section, **Then** 2-3 questions are displayed with
   multiple-choice options.
2. **Given** a question, **When** the user selects an answer, **Then**
   immediate feedback shows whether it is correct or incorrect.
3. **Given** an incorrect answer, **When** feedback is shown, **Then** the
   correct answer and a brief explanation are also revealed.
4. **Given** a completed knowledge check, **When** the user revisits the item,
   **Then** the check is shown as completed with their previous result visible.
5. **Given** an item without knowledge check questions, **When** the detail
   view opens, **Then** the knowledge check section is not displayed.

---

### User Story 4 - Discover Related Content (Priority: P4)

After reading an item, the user can see a list of related items — either from
the same topic or tagged with similar keywords — to continue their learning
without going back to the main feed.

**Why this priority**: Related content turns isolated reading into a learning
path, increasing depth without requiring manual searching.

**Independent Test**: Open any item, scroll to the related content section, and
click a suggestion — it opens the related item's detail view.

**Acceptance Scenarios**:

1. **Given** an item detail view, **When** the user scrolls to the bottom,
   **Then** a "Related Content" section shows 2-4 related items.
2. **Given** a related content suggestion, **When** the user clicks it, **Then**
   the related item's detail view opens.
3. **Given** an item with no related content defined, **When** the detail view
   loads, **Then** the related content section is not shown.

---

### User Story 5 - Weekly Content Refresh via Claude Code Trigger (Priority: P5)

The operator uses a Claude Code scheduled trigger (weekly cron job) that
searches for the past 7 days of AI news across all sources and topic areas,
then generates a fresh `news.json` file. No API key is needed — it runs under
the Claude Pro plan. After reviewing and redeploying, the app shows the latest
content.

**Why this priority**: Without fresh data, the app becomes stale. The Claude
Code trigger is the content pipeline for Phase 1 MVP.

**Independent Test**: Run the trigger (or ask Claude Code manually), inspect
the generated `news.json` — it must contain valid items across all 4 topic
areas for the last 7 days.

**Acceptance Scenarios**:

1. **Given** the Claude Code trigger runs, **When** it completes, **Then** a
   valid `news.json` file is generated at the expected location.
2. **Given** the generated file, **When** inspected, **Then** it contains items
   from all 4 topic areas with the required fields populated.
3. **Given** the generated file, **When** the app is loaded, **Then** all new
   items are displayed correctly in the feed.
4. **Given** a previous `news.json` exists, **When** the trigger runs in weekly
   mode, **Then** new items are appended to the existing `items` array,
   `generatedAt`, `weekOf`, and `coverageEnd` are updated, and all previously
   existing items are preserved unchanged.

---

### Edge Cases

- What if a YouTube video is removed or unavailable? Show a fallback placeholder
  with the original source URL so the user can still access the content.
- What if `news.json` is missing or malformed when the app loads? Show a clear
  error state explaining that a content refresh is needed.
- What if no items match the selected topic filter? Show a friendly empty state
  (not a blank screen).
- What if an item has no `youtube_id`? Omit the video player; show article link
  as the primary entry point.
- What if the user's note is very long? Allow scrolling within the note field
  with no enforced character limit for MVP.
- What if the same item appears under multiple topics? Allow items to carry
  multiple topic tags and appear in each relevant filtered view.

## Requirements *(mandatory)*

### Functional Requirements

**Feed & Navigation**

- **FR-001**: System MUST display a news feed of items loaded from `news.json`.
- **FR-002**: System MUST display the default home view as all 4 topic sections
  simultaneously, each labelled with its topic name and listing its items.
- **FR-003**: Users MUST be able to filter the feed by selecting a single topic,
  which collapses the view to show only that topic's items.
- **FR-004**: Users MUST be able to navigate to any item's detail view.
- **FR-005**: System MUST support direct URL navigation to topic views and
  individual item detail pages (deep-linking).

**Item Detail**

- **FR-006**: System MUST display an embedded YouTube player for items with a
  video source.
- **FR-007**: System MUST display a structured breakdown per item: summary, key
  concepts, and why it matters.
- **FR-008**: System MUST display source type, publication date, and original
  source link for every item.
- **FR-009**: System MUST support the following content types: YouTube video,
  article, arXiv paper, social post.

**Bookmarks & Notes**

- **FR-010**: Users MUST be able to bookmark any item with a single action.
- **FR-011**: Users MUST be able to remove a bookmark with a single action.
- **FR-012**: Users MUST be able to add and edit a personal note on any item.
- **FR-013**: System MUST persist bookmarks and notes across browser sessions
  without requiring an account or login.
- **FR-014**: Users MUST be able to view all bookmarked items in a dedicated
  bookmarks view.

**Knowledge Checks**

- **FR-015**: System MUST display knowledge check questions for items that
  include them in the data.
- **FR-016**: Each knowledge check MUST provide multiple-choice answer options.
- **FR-017**: System MUST display correct/incorrect feedback immediately after
  each answer is selected.
- **FR-018**: System MUST show the correct answer and explanation after an
  incorrect attempt.
- **FR-019**: System MUST persist knowledge check completion state across
  sessions.

**Search**

- **FR-019a**: Users MUST be able to search items in real-time by typing in the
  nav bar search input. Search MUST filter across `title`, `summary`, and `tags`
  fields client-side (no server required). Results update instantly as the user
  types. Clearing the input restores the full feed.
- **FR-019b**: Search and topic filter MUST compose — applying both simultaneously
  shows items matching both the search query AND the selected topic.

**Related Content**

- **FR-020**: System MUST display related content suggestions for items that
  have them defined in the data. Related items are determined by the seed
  script's LLM pass and stored as IDs in `related_ids`.
- **FR-021**: Clicking a related content suggestion MUST navigate to that item's
  detail view.

**Data & Content Seed**

- **FR-022**: A Claude Code scheduled trigger MUST update `public/data/news.json`
  by appending items covering the previous 7 days using web search to discover,
  summarize, and structure content automatically. An initial generation mode
  MUST produce a full month of content (4 weeks). No external API key required.
- **FR-022a**: The trigger MUST produce a human-reviewable draft that the
  operator can inspect and optionally edit before committing the output.
- **FR-022b**: The trigger MUST auto-generate 2-3 multiple-choice knowledge
  check questions per item during the same pass that produces the summary
  and breakdown fields.
- **FR-023**: The trigger MUST produce content across all 4 topic areas.
- **FR-024**: Each item in `news.json` MUST conform to the schema defined in
  `contracts/news-schema.md`, including fields: `id`, `topics`, `type`,
  `title`, `sourceUrl`, `publishedAt`, `summary`, `keyConcepts`,
  `whyItMatters`, `tags`, `relatedIds`, and `knowledgeChecks`.
- **FR-025**: `youtube_id` is optional in the schema and MUST only be present
  for video items.

### Topic Definitions

#### 1. AI Engineering & Skill Development (`ai-engineering`)

News, tutorials, tools, frameworks, and best practices focused on how AI
improves software engineering, system design, and developer productivity.
Emphasizes practical learning and skill growth for software engineers, including
AI-assisted coding workflows, architecture patterns, development tools, testing
automation, debugging support, DevOps integration, and engineering leadership.

Examples: AI coding assistants (GitHub Copilot, Claude), agentic coding
workflows, software tutorials and hands-on guides, AI-assisted system design,
code review and test generation, developer productivity tools.

**Primary research question**: How can this help improve my software engineering
skills, workflow, and technical leadership capabilities?

#### 2. AI Research & Future Technology (`ai-research`)

News and research focused on emerging AI technologies, scientific breakthroughs,
computer science innovation, and advancements that may shape the future of
software, products, and society. Includes research papers, model architecture
breakthroughs, multimodal systems, robotics, reasoning models, and
next-generation AI capabilities not necessarily tied to immediate engineering
use cases.

Examples: research papers and arXiv preprints, model architecture breakthroughs,
multimodal AI systems, reasoning and long-context models, on-device AI and edge
computing, future human-AI interaction paradigms.

**Primary research question**: What new AI knowledge or technological
breakthrough may influence the future of technology and society?

#### 3. AI Career & Workforce Intelligence (`ai-career`)

News and analysis focused on how AI is changing the job market, workforce
structure, hiring trends, role evolution, and skill requirements across
industries. Tracks career risks, new opportunities, layoffs, emerging job roles,
and the evolving skills needed to remain competitive in the AI era.

Examples: layoffs and workforce restructuring, hiring trends in AI-related
roles, new job categories and responsibilities, salary and market demand shifts,
skill requirements for the AI era, workforce automation impact.

**Primary research question**: How is AI changing the job market, and what new
skills should I develop to stay future-ready?

#### 4. AI Industry Strategy & Product Landscape (`ai-industry`)

News focused on company strategy, product launches, startup activity, market
competition, and the broader commercial AI ecosystem. Tracks how organizations
are building products, competing strategically, investing in AI, and shaping the
business landscape. Examples may involve companies such as OpenAI, Microsoft,
Google, and Amazon.

Examples: product launches and feature announcements, startup funding and
acquisitions, Big Tech AI strategy updates, enterprise AI platforms, competitive
market analysis, ecosystem and platform trends.

**Primary research question**: How is the AI industry evolving, and where is
the market heading strategically?

### Key Entities

- **NewsItem**: Represents a single curated content piece. Attributes: unique
  identifier (URL-derived slug, e.g., `youtube-abc123`, `arxiv-2401-12345`),
  topic category (one or more), content type (video/article/paper/social),
  title, source URL, optional YouTube ID, publication date, AI-generated
  summary, key concepts list, why-it-matters explanation, tags, list of related
  item IDs, list of knowledge check questions.

- **KnowledgeCheck**: An embedded assessment within a NewsItem. Attributes:
  question text, multiple-choice options, correct answer index, explanation
  shown after answering.

- **UserPreferences**: Represents the local state of a user's engagement.
  Attributes: set of bookmarked item IDs, map of item ID to personal note text,
  map of item ID to knowledge check completion result. Stored in the browser.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can open the app and read a full news item detail (including
  breakdown) within 30 seconds of the app loading.
- **SC-002**: Topic filtering responds instantly — the feed updates without any
  perceptible delay after selecting a topic.
- **SC-003**: Bookmarks and notes saved in one browser session are available in
  a new session opened the next day, without any login.
- **SC-004**: Every item that includes knowledge check questions presents them
  within the detail view without requiring any additional navigation.
- **SC-005**: The Claude Code trigger produces a valid `news.json` containing at
  least 3 items per topic area, covering the past 7 days, within a single run.
- **SC-006**: All 4 topic areas are represented with content after every weekly
  refresh.
- **SC-007**: Embedded YouTube videos play within the app without redirecting
  the user to an external page.

## Clarifications

### Session 2026-03-28

- Q: How is content generated? → A: A Claude Code scheduled trigger (cron job)
  uses web search to discover, summarize, and structure items automatically;
  operator reviews draft before deploying. No API keys required.
- Q: Who authors knowledge check questions? → A: AI-generated automatically
  during the content generation pass, alongside the summary and breakdown fields.
- Q: What is the default feed view when no topic filter is selected? → A: All
  4 topics displayed simultaneously as labelled sections, each showing their
  items — a dashboard-style home page.
- Q: How are related items determined? → A: AI-suggested during content
  generation — related items from the same batch are linked by ID.
- Q: What format are item IDs? → A: URL-derived slug (e.g., `youtube-abc123`,
  `arxiv-2401-12345`) — human-readable, stable if the same content reappears.

## Assumptions

- Users have a stable internet connection; embedded YouTube playback requires
  connectivity. Offline mode is out of scope for Phase 1.
- Content is generated via a Claude Code scheduled trigger (weekly cron job)
  that uses web search to discover and summarize content automatically. The
  operator reviews and optionally edits the output before deploying. No
  external API keys (YouTube Data API, RSS aggregators, Anthropic API) are
  required.
- No user authentication is required for Phase 1. All visitors see identical
  content. Access control (if needed) is handled at the deployment/hosting
  level.
- Bookmarks and notes are stored per-browser. Cross-device sync is out of scope
  for Phase 1.
- Mobile responsiveness is desirable but not a hard requirement for Phase 1 MVP.
- The app is deployed for a single primary user and a small group of friends;
  no multi-tenancy, per-user analytics, or user management is needed.
- At least one meaningful piece of AI-related content is published per topic
  area per week — if a topic has no new content, it may show zero items for
  that week.
