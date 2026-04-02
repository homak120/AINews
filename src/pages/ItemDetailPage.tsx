import { useParams } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { Header } from '../components/layout/Header';
import { ItemDetail } from '../components/item/ItemDetail';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getById, isLoading, error } = useNews();
  const { preferences } = useUserPreferences();

  const item = id ? getById(id) : undefined;

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
          onSearch={() => {}}
          bookmarkCount={preferences.bookmarks.length}
        />

        <main className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-5 py-8">
          {isLoading && <LoadingState />}
          {error && <ErrorState message={error} />}
          {!isLoading && !error && !item && (
            <ErrorState message={`Item not found: "${id ?? ''}"`} />
          )}
          {!isLoading && !error && item && (
            <ItemDetail item={item} />
          )}
        </main>
      </div>
    </div>
  );
}
