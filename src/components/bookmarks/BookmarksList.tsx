import { useBookmarks } from '../../hooks/useBookmarks';
import { useNews } from '../../hooks/useNews';
import { useNotes } from '../../hooks/useNotes';
import { BookmarkCard } from './BookmarkCard';
import { EmptyState } from '../common/EmptyState';

export function BookmarksList() {
  const { bookmarks } = useBookmarks();
  const { getById } = useNews();
  const { getNote } = useNotes();

  if (bookmarks.length === 0) {
    return <EmptyState message="No bookmarks yet. Bookmark items to save them here." />;
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      {bookmarks.map((id) => {
        const item = getById(id);
        if (!item) return null;
        return (
          <BookmarkCard key={id} item={item} note={getNote(id)} />
        );
      })}
    </div>
  );
}
