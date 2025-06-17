import React, { useState, useEffect } from 'react';
import { Book, BookDetails, Author } from '../types/book';
import { OpenLibraryAPI } from '../services/openLibraryApi';
import { X, Star, Calendar, BookOpen, User, Globe, Heart, Users } from 'lucide-react';

interface BookModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export const BookModal: React.FC<BookModalProps> = ({ book, isOpen, onClose }) => {
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && book) {
      loadBookDetails();
    }
  }, [isOpen, book]);

  const loadBookDetails = async () => {
    try {
      setLoading(true);
      
      // Load book details
      const details = await OpenLibraryAPI.getBookDetails(book.key);
      setBookDetails(details);

      // Load author details
      if (book.author_key && book.author_key.length > 0) {
        const authorPromises = book.author_key.slice(0, 3).map(key => 
          OpenLibraryAPI.getAuthor(`/authors/${key}`)
        );
        const authorResults = await Promise.allSettled(authorPromises);
        const loadedAuthors = authorResults
          .filter((result): result is PromiseFulfilledResult<Author> => result.status === 'fulfilled')
          .map(result => result.value);
        setAuthors(loadedAuthors);
      }
    } catch (error) {
      console.error('Failed to load book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDescription = () => {
    if (!bookDetails?.description) return null;
    
    if (typeof bookDetails.description === 'string') {
      return bookDetails.description;
    }
    
    if (typeof bookDetails.description === 'object' && bookDetails.description.value) {
      return bookDetails.description.value;
    }
    
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-900 truncate pr-4">
            {book.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Book Cover */}
              <div className="md:col-span-1">
                <div className="sticky top-6">
                  {book.cover_i ? (
                    <img
                      src={OpenLibraryAPI.getCoverUrl(book.cover_i, 'L')}
                      alt={book.title}
                      className="w-full rounded-xl shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/300x450/e5e7eb/6b7280?text=No+Cover';
                      }}
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-gray-400" />
                    </div>
                  )}

                  {/* Book Stats */}
                  <div className="mt-6 space-y-3">
                    {book.ratings_average && (
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{book.ratings_average.toFixed(1)}</span>
                        {book.ratings_count && (
                          <span className="text-gray-500">({book.ratings_count.toLocaleString()} ratings)</span>
                        )}
                      </div>
                    )}
                    
                    {book.want_to_read_count && (
                      <div className="flex items-center space-x-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        <span className="text-gray-700">{book.want_to_read_count.toLocaleString()} want to read</span>
                      </div>
                    )}

                    {book.currently_reading_count && (
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-700">{book.currently_reading_count.toLocaleString()} currently reading</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Book Details */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  
                  {/* Authors */}
                  {authors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {authors.map((author, index) => (
                        <div key={author.key} className="flex items-center space-x-1">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-lg text-gray-700 font-medium">{author.name}</span>
                          {index < authors.length - 1 && <span className="text-gray-400">,</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Publication Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                    {book.first_publish_year && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>First published {book.first_publish_year}</span>
                      </div>
                    )}
                    
                    {bookDetails?.number_of_pages && (
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{bookDetails.number_of_pages} pages</span>
                      </div>
                    )}

                    {book.language && book.language.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Globe className="w-4 h-4" />
                        <span>{book.language[0].toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {getDescription() && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {getDescription()?.substring(0, 500)}
                      {getDescription() && getDescription()!.length > 500 && '...'}
                    </p>
                  </div>
                )}

                {/* Subjects/Genres */}
                {book.subject && book.subject.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Subjects</h3>
                    <div className="flex flex-wrap gap-2">
                      {book.subject.slice(0, 10).map((subject, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publishers */}
                {book.publisher && book.publisher.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Publishers</h3>
                    <div className="flex flex-wrap gap-2">
                      {book.publisher.slice(0, 5).map((publisher, index) => (
                        <span key={index} className="text-gray-700">
                          {publisher}
                          {index < Math.min(book.publisher!.length, 5) - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Bios */}
                {authors.some(author => author.bio) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Author{authors.length > 1 ? 's' : ''}</h3>
                    <div className="space-y-4">
                      {authors.filter(author => author.bio).map((author) => (
                        <div key={author.key}>
                          <h4 className="font-medium text-gray-900 mb-1">{author.name}</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {typeof author.bio === 'string' 
                              ? author.bio.substring(0, 300) + (author.bio.length > 300 ? '...' : '')
                              : 'Biography not available'
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};