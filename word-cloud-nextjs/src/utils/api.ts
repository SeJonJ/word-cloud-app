import axios from 'axios';
import { WordData } from '@/components/WordCloud/types';

// API 클라이언트 설정
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.datamuse.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 검색어를 기반으로 단어 데이터를 가져옵니다.
 * @param query 검색어
 * @returns 단어 데이터 배열
 */
export const searchWords = async (query: string): Promise<WordData[]> => {
  if (!query || query.trim() === '') {
    throw new Error('검색어를 입력해주세요.');
  }

  try {
    // max 100개의 관련 단어 검색
    const response = await apiClient.get('/wordCloud', {
      params: {
        word: query, // 의미적으로 유사한 단어
      },
    });

    // API 응답 유효성 검사
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('API 응답 형식이 올바르지 않습니다.');
    }

    // WordData 형식으로 변환
    const words: WordData[] = response.data
      .filter(item => item.word && typeof item.score === 'number')
      .map(item => ({
        text: item.word,
        value: item.score,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 500); // 최대 300개 사용

    return words;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 네트워크 또는 서버 에러 처리
      if (!error.response) {
        throw new Error('네트워크 연결에 문제가 있습니다.');
      }
      
      const status = error.response.status;
      if (status === 404) {
        throw new Error('API 엔드포인트를 찾을 수 없습니다.');
      } else if (status >= 500) {
        throw new Error('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
      } else {
        throw new Error(`API 요청 오류 (${status}): ${error.response.data?.message || error.message}`);
      }
    }
    // 기타 에러는 그대로 전달
    throw error;
  }
};

export default apiClient; 