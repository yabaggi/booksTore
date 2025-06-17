import React, { useState, useEffect } from 'react';
import { Book } from '../types/book';
import { BookCard } from './BookCard';
import { OpenLibraryAPI } from '../services/openLibraryApi';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface BookGalleryProps {
  title: string;
  books?: Book[];
  genre?: string;
  onBookClick?: (book: Book) => void;
}

export const BookGallery: React.FC<BookGalleryProps> = ({ 
  title, 
  books: initialBooks, 
  genre, 
  onBookClick 
}) => {
  const [books, setBooks] = useState<Book[]>(initialBooks || []);
  const [loading, setLoading] = useState(!initialBooks);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!initialBooks && genre) {
      loadBooks();
    }
  }, [genre, initialBooks]);

  const loadBooks = async () => {
    if (!genre) return;
    
    try {
      setLoading(true);
      const response = await OpenLibraryAPI.getBooksBySubject(genre, 20);
      setBooks(response.docs.filter(book => book.cover_i));
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`gallery-${title.replace(/\s+/g, '-')}`);
    if (!container) return;

    const scrollAmount = 320; // Width of card + gap
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (books.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200 disabled:opacity-50"
            disabled={scrollPosition === 0}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div
        id={`gallery-${title.replace(/\s+/g, '-')}`}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {books.map((book, index) => (
          <div key={`${book.key}-${index}`} className="flex-shrink-0">
            <BookCard
              book={book}
              onClick={() => onBookClick?.(book)}
              size="medium"
            />
          </div>
        ))}
      </div>
    </div>
  );
};