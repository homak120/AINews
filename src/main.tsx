import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { NewsProvider } from './context/NewsContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import { HomePage } from './pages/HomePage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { BookmarksPage } from './pages/BookmarksPage';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <NewsProvider>
        <UserPreferencesProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/item/:id" element={<ItemDetailPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
          </Routes>
        </UserPreferencesProvider>
      </NewsProvider>
    </BrowserRouter>
  </StrictMode>
);
