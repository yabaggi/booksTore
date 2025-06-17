import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search for books, authors, or genres..." 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center bg-white rounded-2xl shadow-lg transition-all duration-300 ${
          isFocused ? 'shadow-2xl ring-2 ring-blue-500 ring-opacity-50' : 'hover:shadow-xl'
        }`}>
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 text-gray-900 placeholder-gray-500 bg-transparent rounded-2xl focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search suggestions could go here */}
      {isFocused && query.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
          <div className="p-4 text-sm text-gray-500">
            Press Enter to search for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};