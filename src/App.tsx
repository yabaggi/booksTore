import React, { useState, useEffect } from 'react';
import { Book } from './types/book';
import { OpenLibraryAPI } from './services/openLibraryApi';
import { SearchBar } from './components/SearchBar';
import { BookGallery } from './components/BookGallery';
import { GenreLandscape } from './components/GenreLandscape';
import { BookModal } from './components/BookModal';
import { AuthorTimeline } from './components/AuthorTimeline';
import { BookOpen, Sparkles, TrendingUp, Loader2 } from 'lucide-react';

function App() {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [selectedGenreBooks, setSelectedGenreBooks] = useState<Book[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<{ key: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load trending books
      const trending = await OpenLibraryAPI.getTrendingBooks();
      setTrendingBooks(trending);
      
      // Load some popular fiction books as featured
      const fictionResponse = await OpenLibraryAPI.getBooksBySubject('fiction', 20);
      const fictionBooks = fictionResponse.docs.filter(book => book.cover_i);
      setSelectedGenreBooks(fictionBooks);
      setSelectedGenre('fiction');
      
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      return;
    }

    try {
      setSearchQuery(query);
      const response = await OpenLibraryAPI.searchBooks(query, 20);
      const booksWithCovers = response.docs.filter(book => book.cover_i);
      setSearchResults(booksWithCovers);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  const handleGenreSelect = async (genre: string) => {
    try {
      setSelectedGenre(genre);
      const response = await OpenLibraryAPI.getBooksBySubject(genre, 20);
      const booksWithCovers = response.docs.filter(book => book.cover_i);
      setSelectedGenreBooks(booksWithCovers);
    } catch (error) {
      console.error('Failed to load genre books:', error);
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleAuthorClick = (authorKey: string, authorName: string) => {
    setSelectedAuthor({ key: authorKey, name: authorName });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your literary journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BookScope
              </h1>
              <p className="text-gray-600 text-sm">Visual Book Explorer</p>
            </div>
          </div>
          
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Results */}
        {searchResults.length > 0 && (
          <BookGallery
            title={`Search Results for "${searchQuery}"`}
            books={searchResults}
            onBookClick={handleBookClick}
          />
        )}

        {/* Genre Landscape */}
        {searchResults.length === 0 && (
          <GenreLandscape onGenreSelect={handleGenreSelect} />
        )}

        {/* Trending Books */}
        {searchResults.length === 0 && trendingBooks.length > 0 && (
          <BookGallery
            title="Trending Now"
            books={trendingBooks}
            onBookClick={handleBookClick}
          />
        )}

        {/* Selected Genre Books */}
        {searchResults.length === 0 && selectedGenreBooks.length > 0 && (
          <BookGallery
            title={`${selectedGenre.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Collection`}
            books={selectedGenreBooks}
            onBookClick={handleBookClick}
          />
        )}

        {/* Popular Genres */}
        {searchResults.length === 0 && (
          <>
            <BookGallery
              title="Fantasy Adventures"
              genre="fantasy"
              onBookClick={handleBookClick}
            />
            <BookGallery
              title="Science Fiction Worlds"
              genre="science_fiction"
              onBookClick={handleBookClick}
            />
            <BookGallery
              title="Mystery & Thriller"
              genre="mystery"
              onBookClick={handleBookClick}
            />
          </>
        )}
      </main>

      {/* Book Modal */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}

      {/* Author Timeline Modal */}
      {selectedAuthor && (
        <AuthorTimeline
          authorKey={selectedAuthor.key}
          authorName={selectedAuthor.name}
          onClose={() => setSelectedAuthor(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">Powered by Open Library API</span>
            </div>
            <p className="text-gray-500 text-sm">
              Discover your next favorite book through visual exploration
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;