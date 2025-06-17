import React from 'react';
import { Book } from '../types/book';
import { OpenLibraryAPI } from '../services/openLibraryApi';
import { Star, Users, Calendar, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-32 h-48',
    medium: 'w-40 h-60',
    large: 'w-48 h-72'
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div 
      className={`${sizeClasses[size]} bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 group overflow-hidden`}
      onClick={onClick}
    >
      <div className="relative h-3/4 overflow-hidden rounded-t-xl">
        {book.cover_i ? (
          <img
            src={OpenLibraryAPI.getCoverUrl(book.cover_i, 'L')}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x450/e5e7eb/6b7280?text=No+Cover';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Overlay with book stats */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end p-3">
          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-1">
            {book.ratings_average && (
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{book.ratings_average.toFixed(1)}</span>
              </div>
            )}
            {book.want_to_read_count && (
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span className="text-xs">{book.want_to_read_count.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 h-1/4 flex flex-col justify-between">
        <div>
          <h3 className={`font-semibold text-gray-900 line-clamp-2 ${textSizes[size]} leading-tight`}>
            {book.title}
          </h3>
          {book.author_name && book.author_name.length > 0 && (
            <p className={`text-gray-600 line-clamp-1 ${textSizes[size]} mt-1`}>
              {book.author_name[0]}
            </p>
          )}
        </div>
        
        {book.first_publish_year && (
          <div className="flex items-center space-x-1 mt-2">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{book.first_publish_year}</span>
          </div>
        )}
      </div>
    </div>
  );
};