export type ContentType = 'video' | 'article' | 'paper' | 'social';

export type SortOrder = 'newest' | 'oldest';

export type Topic =
  | 'ai-engineering'
  | 'ai-research'
  | 'ai-career'
  | 'ai-industry';

export interface KnowledgeCheck {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface NewsItem {
  id: string;
  topics: Topic[];
  type: ContentType;
  title: string;
  sourceUrl: string;
  youtubeId?: string;
  publishedAt: string;
  summary: string;
  keyConcepts: string[];
  whyItMatters: string;
  tags: string[];
  relatedIds: string[];
  knowledgeChecks: KnowledgeCheck[];
}

export interface NewsData {
  generatedAt: string;
  weekOf: string;
  items: NewsItem[];
}

export interface Manifest {
  files: string[];
}

export interface KnowledgeCheckResult {
  completedAt: string;
  answers: number[];
}

export interface UserPreferences {
  bookmarks: string[];
  notes: Record<string, string>;
  knowledgeCheckResults: Record<string, KnowledgeCheckResult>;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  bookmarks: [],
  notes: {},
  knowledgeCheckResults: {},
};

export const TOPIC_DISPLAY_NAMES: Record<Topic, string> = {
  'ai-engineering': 'AI Engineering & Skill Development',
  'ai-research': 'AI Research & Future Technology',
  'ai-career': 'AI Career & Workforce Intelligence',
  'ai-industry': 'AI Industry Strategy & Product Landscape',
};
