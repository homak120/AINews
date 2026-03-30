import { TOPIC_DISPLAY_NAMES, type NewsItem, type Topic } from '../../types';
import { TopicFilter } from '../layout/TopicFilter';
import { TopicSection } from './TopicSection';

const ALL_TOPICS = Object.keys(TOPIC_DISPLAY_NAMES) as Topic[];

interface NewsFeedProps {
  items: NewsItem[];
  activeTopic: Topic | null;
  onTopicChange: (topic: Topic | null) => void;
  bookmarkedIds?: Set<string>;
}

export function NewsFeed({ items, activeTopic, onTopicChange, bookmarkedIds = new Set() }: NewsFeedProps) {
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
            bookmarkedIds={bookmarkedIds}
          />
        ))}
      </div>

      {/* Mobile: single column view for active topic */}
      <div className="md:hidden flex flex-col gap-4">
        {visibleTopics.map((topic) => (
          <TopicSection
            key={topic}
            topic={topic}
            items={getItemsForTopic(topic)}
            bookmarkedIds={bookmarkedIds}
          />
        ))}
      </div>
    </div>
  );
}
