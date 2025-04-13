import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { WordCloudProps, WordCloudConfig } from './types';
import { useWordCloud } from './useWordCloud';
import Controls from './Controls';
import ExportButton from './ExportButton';
import { DEFAULT_DIMENSIONS } from './constants';
import * as d3 from 'd3';

/**
 * 워드 클라우드 컴포넌트
 * 단어 빈도에 따라 시각적으로 표현하는 컴포넌트
 */
const WordCloud: React.FC<WordCloudProps> = ({ 
  words, 
  width = DEFAULT_DIMENSIONS.width, 
  height = DEFAULT_DIMENSIONS.height,
  shape = 'circle' 
}) => {
  // 폭과 높이를 number 타입으로 확실히 처리
  const widthPx = typeof width === 'number' ? width : Number(width);
  const heightPx = typeof height === 'number' ? height : Number(height);
  
  // 컨트롤 패널은 항상 오른쪽 하단에 고정
  const controlPosition = 'right';
  // 툴팁 관련 ref
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // 호버된 단어 상태
  const [hoveredWordId, setHoveredWordId] = useState<string | null>(null);
  
  const {
    config,
    preparedWords,
    colorScale,
    handleConfigChange,
    svgRef
  } = useWordCloud(words, widthPx, heightPx, shape);

  // Portal을 사용하기 위한 state
  const [isMounted, setIsMounted] = useState(false);
  
  // 컴포넌트가 마운트된 후에 Portal 활성화
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // 툴팁 기능 설정
  useEffect(() => {
    if (!tooltipRef.current) return;
    
    // D3 스타일의 툴팁 초기화
    const tooltip = d3.select(tooltipRef.current)
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0, 0, 0, 0.75)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '4px')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .style('z-index', '100')
      .style('white-space', 'nowrap')
      .style('box-shadow', '0 2px 5px rgba(0, 0, 0, 0.2)')
      .style('transition', 'opacity 0.2s');
  }, []);
  
  // 툴팁 표시 함수
  const showTooltip = (event: React.MouseEvent, word: any, wordId: string) => {
    if (!tooltipRef.current || !containerRef.current) return;
    
    // 호버된 단어 ID 설정
    setHoveredWordId(wordId);
    
    // SVG 요소의 위치 정보 가져오기
    const containerRect = containerRef.current.getBoundingClientRect();
    const tooltip = d3.select(tooltipRef.current);
    
    // 마우스 커서 위치(뷰포트 기준)
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    // 컨테이너 상대적인 좌표로 변환
    const relativeX = mouseX - containerRect.left;
    const relativeY = mouseY - containerRect.top;
    
    // 툴팁이 화면 밖으로 나가지 않도록 위치 조정
    tooltip
      .html(`<strong>${word.text}:</strong> ${word.value}개`)
      .style('visibility', 'visible')
      .style('opacity', '1');
    
    // 툴팁 크기 계산
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    // 최종 위치 계산 (마우스 포인터 오른쪽 위에 위치)
    const tooltipX = Math.min(
      relativeX + 15, 
      containerRect.width - tooltipRect.width - 5
    );
    const tooltipY = Math.max(
      relativeY - tooltipRect.height - 10,
      5
    );
    
    tooltip
      .style('left', `${tooltipX}px`)
      .style('top', `${tooltipY}px`);
  };
  
  // 툴팁 숨기기 함수
  const hideTooltip = () => {
    if (!tooltipRef.current) return;
    
    // 호버된 단어 ID 초기화
    setHoveredWordId(null);
    
    const tooltip = d3.select(tooltipRef.current);
    tooltip
      .style('opacity', '0')
      .style('visibility', 'hidden');
  };

  // 단어 엘리먼트를 미리 계산하여 리렌더링 최소화
  const wordElements = useMemo(() => {
    if (!preparedWords.length) return null;
    
    return preparedWords.map((word, i) => {
      const wordId = `${word.text}-${i}`;
      const isHovered = hoveredWordId === wordId;
      
      // 확대 효과를 위한 스케일 계산
      const scale = isHovered ? 1.2 : 1;
      
      return (
        <g 
          key={wordId}
          onMouseMove={(e) => showTooltip(e, word, wordId)}
          onMouseOut={hideTooltip}
          className="word-group"
          transform={`translate(${word.x},${word.y}) rotate(${word.rotate}) scale(${scale})`}
        >
          <text
            style={{
              fill: colorScale(word.value),
              fontSize: `${word.size}px`,
              fontFamily: 'Noto Sans KR, sans-serif',
              cursor: 'pointer',
              fontWeight: isHovered ? 'bold' : 'normal',
              filter: isHovered ? 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' : 'none',
              transition: 'font-weight 0.2s, filter 0.2s',
            }}
            textAnchor="middle"
            className="word-text"
            aria-label={`${word.text}: ${word.value}개`}
          >
            {word.text}
          </text>
        </g>
      );
    });
  }, [preparedWords, colorScale, hoveredWordId]);

  // 설정 변경 핸들러 통합
  const handleChange = useMemo(() => {
    return (key: keyof WordCloudConfig) => (value: any) => {
      handleConfigChange(key, value);
    };
  }, [handleConfigChange]);

  // 전역 CSS 스타일 추가
  useEffect(() => {
    // SVG 텍스트 요소의 호버 효과를 위한 스타일
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .word-group {
        transition: transform 0.2s ease-out;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // 검색 키워드 추출 (words 배열에서 가장 빈도가 높은 단어)
  const topKeyword = useMemo(() => {
    if (!words || words.length === 0) return 'wordcloud';
    // 빈도수 기준으로 정렬하여 가장 높은 단어 반환
    return [...words].sort((a, b) => b.value - a.value)[0]?.text || 'wordcloud';
  }, [words]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* D3 스타일 툴팁 */}
      <div ref={tooltipRef} className="d3-tooltip"></div>
      
      {/* 워드 클라우드 SVG */}
      <svg
        ref={svgRef}
        width={widthPx}
        height={heightPx}
        className="mx-auto"
        style={{ background: 'transparent' }}
        aria-label="워드 클라우드 시각화"
      >
        <g transform={`translate(${widthPx / 2},${heightPx / 2})`}>
          {wordElements}
        </g>
      </svg>

      {/* 설정 컨트롤 패널 - Portal을 통해 body에 직접 렌더링 */}
      {isMounted && createPortal(
        <>
          <Controls
            config={config}
            position={controlPosition}
            onMinFontSizeChange={handleChange('minFontSize')}
            onMaxFontSizeChange={handleChange('maxFontSize')}
            onPaddingChange={handleChange('padding')}
            onColorThemeChange={handleChange('colorTheme')}
            onShapeChange={handleChange('shape')}
            onRotationModeChange={handleChange('rotationMode')}
            onRotationAngleChange={handleChange('rotationAngle')}
          />
          <ExportButton svgRef={svgRef} containerRef={containerRef} searchKeyword={topKeyword} />
        </>,
        document.body
      )}
    </div>
  );
};

// React.memo로 컴포넌트 최적화
export default React.memo(WordCloud);