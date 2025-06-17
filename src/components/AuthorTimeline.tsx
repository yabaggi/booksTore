import React, { useState, useEffect } from 'react';
import { Author } from '../types/book';
import { OpenLibraryAPI } from '../services/openLibraryApi';
import { Calendar, BookOpen, User, Loader2 } from 'lucide-react';

interface AuthorTimelineProps {
  authorKey: string;
  authorName: string;
  onClose: () => void;
}

interface AuthorWork {
  key: string;
  title: string;
  first_publish_date?: string;
  covers?: number[];
}

export const AuthorTimeline: React.FC<AuthorTimelineProps> = ({ 
  authorKey, 
  authorName, 
  onClose 
}) => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [works, setWorks] = useState<AuthorWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthorData();
  }, [authorKey]);

  const loadAuthorData = async () => {
    try {
      setLoading(true);
      
      // Load author details
      const authorData = await OpenLibraryAPI.getAuthor(`/authors/${authorKey}`);
      setAuthor(authorData);

      // Load author works
      const worksData = await OpenLibraryAPI.getAuthorWorks(authorKey, 20);
      const worksWithDates = worksData.entries
        .filter(work => work.title)
        .map(work => ({
          key: work.key,
          title: work.title,
          first_publish_date: work.first_publish_date,
          covers: work.covers
        }))
        .sort((a, b) => {
          const yearA = a.first_publish_date ? parseInt(a.first_publish_date) : 9999;
          const yearB = b.first_publish_date ? parseInt(b.first_publish_date) : 9999;
          return yearA - yearB;
        });

      setWorks(worksWithDates);
    } catch (error) {
      console.error('Failed to load author data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    
    // Handle various date formats
    const year = dateString.match(/\d{4}/)?.[0];
    return year || dateString;
  };

  const getLifespan = () => {
    if (!author) return '';
    
    const birth = author.birth_date ? formatDate(author.birth_date) : '?';
    const death = author.death_date ? formatDate(author.death_date) : '';
    
    if (death) {
      return `${birth} - ${death}`;
    } else if (birth !== '?') {
      return `${birth} - present`;
    }
    
    return '';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{authorName}</h2>
              {getLifespan() && (
                <p className="text-gray-600 mt-1">{getLifespan()}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <User className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Author Bio */}
          {author?.bio && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Biography</h3>
              <p className="text-gray-700 leading-relaxed">
                {typeof author.bio === 'string' 
                  ? author.bio.substring(0, 500) + (author.bio.length > 500 ? '...' : '')
                  : 'Biography not available'
                }
              </p>
            </div>
          )}

          {/* Works Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Published Works</h3>
            
            {works.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No works found for this author.</p>
            ) : (
              <div className="space-y-4">
                {works.map((work, index) => (
                  <div key={work.key} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 w-16 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      {work.covers && work.covers.length > 0 ? (
                        <img
                          src={OpenLibraryAPI.getCoverUrl(work.covers[0], 'S')}
                          alt={work.title}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <BookOpen className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-900 mb-1">{work.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(work.first_publish_date)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};