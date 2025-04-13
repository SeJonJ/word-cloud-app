import React, { useState, FormEvent } from 'react';
import { CloudShape } from './WordCloud/types';

interface SearchBarProps {
  onSearch: (query: string, shape: CloudShape) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [shape, setShape] = useState<CloudShape>('circle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), shape);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="분석할 텍스트를 입력하세요"
              className="w-full px-6 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl 
                       shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300
                       dark:text-white"
              disabled={isLoading}
            />
            {isLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`px-8 py-3 text-white font-medium rounded-xl transition-all duration-300
                       ${isLoading || !query.trim() 
                         ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                         : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/30'
                       }
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                분석 중...
              </span>
            ) : (
              '검색하기'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar; 