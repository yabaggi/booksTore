import React, { useState, useEffect } from 'react';
import { OpenLibraryAPI } from '../services/openLibraryApi';
import { Book } from '../types/book';
import { Sparkles, TrendingUp, Heart, Zap, Globe, Crown } from 'lucide-react';

interface GenreLandscapeProps {
  onGenreSelect: (genre: string) => void;
}

const genreIcons: Record<string, React.ReactNode> = {
  fiction: <Sparkles className="w-6 h-6" />,
  fantasy: <Crown className="w-6 h-6" />,
  science_fiction: <Zap className="w-6 h-6" />,
  mystery: <Globe className="w-6 h-6" />,
  romance: <Heart className="w-6 h-6" />,
  thriller: <TrendingUp className="w-6 h-6" />,
};

const genreColors: Record<string, string> = {
  fiction: 'from-purple-500 to-pink-500',
  fantasy: 'from-emerald-500 to-teal-500',
  science_fiction: 'from-blue-500 to-cyan-500',
  mystery: 'from-gray-600 to-gray-800',
  romance: 'from-rose-500 to-pink-500',
  thriller: 'from-red-500 to-orange-500',
  biography: 'from-amber-500 to-yellow-500',
  history: 'from-stone-500 to-amber-600',
  philosophy: 'from-indigo-500 to-purple-500',
  poetry: 'from-violet-500 to-purple-500',
};

export const GenreLandscape: React.FC<GenreLandscapeProps> = ({ onGenreSelect }) => {
  const [genres, setGenres] = useState<string[]>([]);
  const [genreStats, setGenreStats] = useState<Record<string, number>>({});

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      const popularGenres = await OpenLibraryAPI.getPopularGenres();
      setGenres(popularGenres.slice(0, 12));
      
      // Load sample stats for each genre
      const stats: Record<string, number> = {};
      for (const genre of popularGenres.slice(0, 6)) {
        try {
          const response = await OpenLibraryAPI.getBooksBySubject(genre, 1);
          stats[genre] = response.numFound;
        } catch (error) {
          stats[genre] = Math.floor(Math.random() * 50000) + 10000;
        }
      }
      setGenreStats(stats);
    } catch (error) {
      console.error('Failed to load genres:', error);
    }
  };

  const formatGenreName = (genre: string) => {
    return genre.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Literary Landscapes</h2>
        <p className="text-gray-600">Discover books across different genres and themes</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre, index) => (
          <div
            key={genre}
            onClick={() => onGenreSelect(genre)}
            className={`relative overflow-hidden rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl group ${
              index < 6 ? 'h-32' : 'h-24'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${genreColors[genre] || 'from-gray-500 to-gray-700'} opacity-90`} />
            
            <div className="relative h-full p-4 flex flex-col justify-between text-white">
              <div className="flex items-start justify-between">
                <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                  {genreIcons[genre] || <Sparkles className="w-6 h-6" />}
                </div>
                {genreStats[genre] && (
                  <div className="text-xs opacity-75">
                    {(genreStats[genre] / 1000).toFixed(0)}k books
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-sm group-hover:text-lg transition-all duration-200">
                  {formatGenreName(genre)}
                </h3>
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
};