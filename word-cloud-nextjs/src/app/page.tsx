'use client';

import { useState, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import WordCloud from '@/components/WordCloud';
import { searchWords } from '@/utils/api';
import { CloudShape, WordData } from '@/components/WordCloud/types';
import axios from 'axios';

export default function Home() {
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentShape, setCurrentShape] = useState<CloudShape>('circle');

  const handleSearch = useCallback(async (query: string, shape: CloudShape) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      setWords([]);
      setCurrentShape(shape);
      
      const data = await searchWords(query);
      
      if (!data || data.length === 0) {
        setError('검색 결과가 없습니다. 다른 검색어를 시도해보세요.');
        return;
      }
      
      setWords(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        } else if (err.response.status === 404) {
          setError('API 엔드포인트를 찾을 수 없습니다.');
        } else {
          setError(`검색 중 오류가 발생했습니다: ${err.response.data?.message || err.message}`);
        }
      } else {
        setError('검색 중 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 
                    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-4 py-4 flex flex-col flex-1">
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              워드 클라우드
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            텍스트를 입력하면 자동으로 단어의 빈도를 분석하여 시각적으로 표현해드립니다.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-4 backdrop-blur-md bg-white/40 dark:bg-gray-800/40 
                      p-4 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20">
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-4 p-4 backdrop-blur-sm bg-red-50/80 dark:bg-red-900/30 
                        rounded-xl border border-red-200/50 dark:border-red-800/50 shadow-lg">
            <p className="text-red-600 dark:text-red-400 text-center font-medium">{error}</p>
          </div>
        )}

        <div className={`flex-1 flex items-center justify-center transition-all duration-500 ease-in-out ${words.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
          {words.length > 0 ? (
            <div className="backdrop-blur-lg bg-white/60 dark:bg-gray-800/60 p-4 rounded-3xl shadow-2xl 
                          border border-white/30 dark:border-gray-700/30 
                          w-full h-full max-w-[1280px] max-h-[720px] aspect-video">
              <WordCloud words={words} shape={currentShape} />
            </div>
          ) : !loading && !error && (
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg font-light italic">
                텍스트를 입력하고 분석하기 버튼을 클릭하면 워드 클라우드가 이 곳에 나타납니다.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
