import { useState } from 'react';
import { cn } from '../../utils/cn';
import { TOPIC_DISPLAY_NAMES, type NewsItem, type Topic } from '../../types';
import { TopicFilter } from '../layout/TopicFilter';
import { TopicSection } from './TopicSection';

const ALL_TOPICS = Object.keys(TOPIC_DISPLAY_NAMES) as Topic[];

const TOPIC_SHORT_LABELS: Record<Topic, string> = {
  'ai-engineering': 'Engineering',
  'ai-research':    'Research',
  'ai-career':      'Career',
  'ai-industry':    'Industry',
};

const TAB_ACCENT: Record<Topic, string> = {
  'ai-engineering': 'bg-violet-500/[0.18] text-violet-400 border-violet-500/[0.28]',
  'ai-research':    'bg-cyan-500/[0.18] text-cyan-400 border-cyan-500/[0.28]',
  'ai-career':      'bg-emerald-500/[0.18] text-emerald-400 border-emerald-500/[0.28]',
  'ai-industry':    'bg-amber-500/[0.18] text-amber-400 border-amber-500/[0.28]',
};

interface NewsFeedProps {
  items: NewsItem[];
  activeTopic: Topic | null;
  onTopicChange: (topic: Topic | null) => void;
}

export function NewsFeed({ items, activeTopic, onTopicChange }: NewsFeedProps) {
  const [mobileTab, setMobileTab] = useState<Topic>(ALL_TOPICS[0] ?? 'ai-engineering');

  const getItemsForTopic = (topic: Topic) =>
    items.filter((item) => item.topics.includes(topic));

  const visibleTopics = activeTopic ? [activeTopic] : ALL_TOPICS;

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6">
        <TopicFilter active={activeTopic} onSelect={onTopicChange} />
      </div>

      {/* Topic columns — 4-col on desktop, 2-col on tablet, hidden on mobile (tab row handles mobile) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleTopics.map((topic) => (
          <TopicSection
            key={topic}
            topic={topic}
            items={getItemsForTopic(topic)}
          />
        ))}
      </div>

      {/* Mobile: horizontal tab row + single topic */}
      <div className="md:hidden">
        <div className="flex gap-1 overflow-x-auto bg-[#0d1526]/90 backdrop-blur-md border border-white/[0.12] rounded-[14px] p-1.5 mb-4">
          {ALL_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setMobileTab(topic)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-[10px] text-sm font-medium whitespace-nowrap transition-all duration-150 border',
                mobileTab === topic
                  ? TAB_ACCENT[topic]
                  : 'border-transparent text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]'
              )}
            >
              {TOPIC_SHORT_LABELS[topic]}
            </button>
          ))}
        </div>
        <TopicSection
          topic={mobileTab}
          items={getItemsForTopic(mobileTab)}
        />
      </div>
    </div>
  );
}
