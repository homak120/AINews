import { useState } from 'react';
import { useNews } from '../hooks/useNews';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { Header } from '../components/layout/Header';
import { NewsFeed } from '../components/feed/NewsFeed';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import type { Topic } from '../types';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const { search, isLoading, error } = useNews();
  const { preferences } = useUserPreferences();

  const filteredItems = search(searchQuery, activeTopic);

  return (
    <div className="min-h-screen bg-[#060a14]">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full
                        bg-[radial-gradient(circle,rgba(167,139,250,0.18)_0%,transparent_70%)]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[700px] h-[700px] rounded-full
                        bg-[radial-gradient(circle,rgba(34,211,238,0.14)_0%,transparent_70%)]" />
        <div className="absolute top-1/2 left-[40%] w-[400px] h-[400px] rounded-full
                        bg-[radial-gradient(circle,rgba(52,211,153,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10">
        <Header
          onSearch={setSearchQuery}
          bookmarkCount={preferences.bookmarks.length}
        />

        <main className="max-w-[1280px] mx-auto px-8 md:px-5 py-8">
          {isLoading && <LoadingState />}
          {error && <ErrorState message={error} />}
          {!isLoading && !error && (
            <NewsFeed
              items={filteredItems}
              activeTopic={activeTopic}
              onTopicChange={setActiveTopic}
            />
          )}
        </main>
      </div>
    </div>
  );
}
