import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import debounce from 'lodash/debounce';
import {
  WordData,
  WordCloudConfig,
  CloudWord,
  CloudShape,
  RotationMode,
} from './types';
import {
  COLOR_THEMES,
  FONT_SIZE_RANGE,
  PADDING_RANGE,
  DEBOUNCE_DELAY,
  DEFAULT_DIMENSIONS,
  ROTATION,
} from './constants';

// d3-cloud의 Word 타입과 우리의 WordData를 결합
type Word = d3.SimulationNodeDatum & WordData & {
  size?: number;
  x?: number;
  y?: number;
  rotate?: number;
};

/**
 * WordCloud 컴포넌트의 로직을 관리하는 커스텀 훅
 */
export const useWordCloud = (
  words: WordData[],
  width = DEFAULT_DIMENSIONS.width as number,
  height = DEFAULT_DIMENSIONS.height as number,
  initialShape: CloudShape = 'circle'
) => {
  const [config, setConfig] = useState<WordCloudConfig>({
    minFontSize: FONT_SIZE_RANGE.default.min,
    maxFontSize: FONT_SIZE_RANGE.default.max,
    padding: PADDING_RANGE.default,
    colorTheme: 'blue',
    shape: initialShape,
    rotationMode: 'none',
    rotationAngle: ROTATION.angles.default,
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const [preparedWords, setPreparedWords] = useState<CloudWord[]>([]);

  // shape prop이 변경되면, 설정 업데이트
  useEffect(() => {
    setConfig(prev => ({ ...prev, shape: initialShape }));
  }, [initialShape]);

  // 폰트 크기 계산 스케일
  const fontScale = useMemo(() => {
    if (!words.length) return null;
    
    const values = words.map(w => w.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // 값이 모두 같으면 중간 크기 사용
    if (minValue === maxValue) {
      const midSize = (config.minFontSize + config.maxFontSize) / 2;
      return d3.scaleLinear<number>()
        .domain([minValue, maxValue])
        .range([midSize, midSize]);
    }
    
    return d3.scaleLinear<number>()
      .domain([minValue, maxValue])
      .range([config.minFontSize, config.maxFontSize]);
  }, [words, config.minFontSize, config.maxFontSize]);

  // 색상 계산 스케일
  const colorScale = useMemo(() => {
    return d3.scaleOrdinal<number, string>()
      .range(COLOR_THEMES[config.colorTheme]);
  }, [config.colorTheme]);

  // 회전 함수 - d3-cloud 라이브러리의 타입 호환성을 위해 any 사용
  const getRotation = useCallback(() => {
    switch (config.rotationMode) {
      case 'none':
        return 0; // 회전 없음 (모든 단어 가로 방향)
      case 'random':
        // -30도 ~ 30도 사이 랜덤
        return () => ~~(Math.random() * 6 - 3) * 10;
      case 'degrees':
        // 설정된 각도의 랜덤 방향 (-angle ~ angle)
        return () => Math.random() > 0.5 
          ? config.rotationAngle 
          : -config.rotationAngle;
      default:
        return 0;
    }
  }, [config.rotationMode, config.rotationAngle]);

  // 워드 클라우드 데이터 준비
  const prepareData = useCallback(async () => {
    if (!words.length || !fontScale) return [];

    // 단어 데이터 준비
    const wordData: Word[] = words.map(w => ({ 
      text: w.text,
      value: w.value,
    }));

    return new Promise<CloudWord[]>((resolve) => {
      // 레이아웃 계산 요청
      cloud()
        .size([width, height])
        .words(wordData)
        .padding(config.padding)
        .rotate(getRotation()) // 회전 함수 적용
        .fontSize(d => fontScale((d as Word).value))
        .spiral(config.shape === 'rectangle' ? 'rectangular' : 'archimedean')
        .on('end', outputWords => {
          // 결과를 CloudWord 타입으로 변환
          const cloudWords = outputWords.map(d => ({
            text: d.text || '',
            value: (d as Word).value,
            size: d.size || 0,
            x: d.x || 0,
            y: d.y || 0,
            rotate: d.rotate || 0
          }));
          resolve(cloudWords);
        })
        .start();
    });
  }, [words, width, height, config.padding, config.shape, fontScale, getRotation]);

  // 워드 클라우드 업데이트 (디바운스 적용)
  const updateWordCloud = useMemo(
    () => debounce(async () => {
      if (!words.length || !fontScale) return;
      
      try {
        const newWords = await prepareData();
        setPreparedWords(newWords);
      } catch (error) {
        console.error('Error generating word cloud:', error);
      }
    }, DEBOUNCE_DELAY),
    [prepareData, words, fontScale]
  );

  // 설정 변경시 워드 클라우드 업데이트
  useEffect(() => {
    updateWordCloud();
    
    // 컴포넌트 언마운트 시 디바운스 취소
    return () => {
      updateWordCloud.cancel();
    };
  }, [updateWordCloud]);

  // 설정 변경 핸들러
  const handleConfigChange = useCallback(<K extends keyof WordCloudConfig>(
    key: K,
    value: WordCloudConfig[K]
  ) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    config,
    preparedWords,
    colorScale,
    svgRef,
    handleConfigChange,
  };
}; 