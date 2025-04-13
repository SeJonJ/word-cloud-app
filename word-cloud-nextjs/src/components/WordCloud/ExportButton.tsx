'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

interface ExportButtonProps {
  svgRef: React.RefObject<SVGSVGElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  searchKeyword?: string;
}

type ExportFormat = 'png' | 'svg' | 'pdf';

const ExportButton: React.FC<ExportButtonProps> = ({ svgRef, containerRef, searchKeyword = 'wordcloud' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 파일명 생성 함수
  const generateFileName = (format: string) => {
    // 검색 키워드에서 파일명에 적합하지 않은 문자 제거 및 짧게 만들기
    const keyword = searchKeyword
      .trim()
      .replace(/[^\w\s-]/g, '')  // 특수문자 제거
      .replace(/\s+/g, '-')      // 공백을 하이픈으로 변경
      .substring(0, 30);         // 최대 30자로 제한
    
    const date = new Date().toISOString().slice(0, 10);
    return `wordcloud-${keyword}-${date}.${format}`;
  };

  // PNG로 내보내기 - SVG 직접 사용
  const exportAsPNG = async () => {
    if (!svgRef.current) return;
    
    try {
      // SVG 복제 및 스타일 적용
      const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;
      
      // viewBox 설정으로 실제 콘텐츠 영역만 포함하도록 조정
      const svgWidth = svgRef.current.width.baseVal.value;
      const svgHeight = svgRef.current.height.baseVal.value;
      
      // 원본 크기 유지
      svgClone.setAttribute('width', String(svgWidth));
      svgClone.setAttribute('height', String(svgHeight));
      
      // 배경색 설정 (투명 또는 흰색)
      svgClone.style.backgroundColor = 'white';
      
      // SVG 문자열로 변환
      const svgData = new XMLSerializer().serializeToString(svgClone);
      
      // 새 이미지에 SVG 데이터 로드
      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      
      img.onload = () => {
        // 캔버스 생성
        const canvas = document.createElement('canvas');
        canvas.width = svgWidth;
        canvas.height = svgHeight;
        
        // 캔버스에 그리기
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          
          // 이미지 데이터 추출 및 다운로드
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = generateFileName('png');
          link.click();
        }
      };
      
      setIsOpen(false);
    } catch (error) {
      console.error('PNG 내보내기 오류:', error);
      alert('PNG 이미지 생성 중 오류가 발생했습니다.');
    }
  };

  // SVG로 내보내기
  const exportAsSVG = () => {
    if (!svgRef.current) return;
    
    try {
      // SVG 복제 및 스타일 적용
      const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;
      
      // viewBox 설정으로 실제 콘텐츠 영역만 포함하도록 조정
      const svgWidth = svgRef.current.width.baseVal.value;
      const svgHeight = svgRef.current.height.baseVal.value;
      
      // 원본 크기 유지
      svgClone.setAttribute('width', String(svgWidth));
      svgClone.setAttribute('height', String(svgHeight));
      
      // SVG 문자열로 변환
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      
      saveAs(svgBlob, generateFileName('svg'));
      setIsOpen(false);
    } catch (error) {
      console.error('SVG 내보내기 오류:', error);
      alert('SVG 이미지 생성 중 오류가 발생했습니다.');
    }
  };

  // PDF로 내보내기
  const exportAsPDF = async () => {
    if (!svgRef.current) return;
    
    try {
      // SVG 복제 및 스타일 적용
      const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;
      
      // viewBox 설정으로 실제 콘텐츠 영역만 포함하도록 조정
      const svgWidth = svgRef.current.width.baseVal.value;
      const svgHeight = svgRef.current.height.baseVal.value;
      
      // 원본 크기 유지
      svgClone.setAttribute('width', String(svgWidth));
      svgClone.setAttribute('height', String(svgHeight));
      svgClone.style.backgroundColor = 'white';
      
      // SVG 문자열로 변환
      const svgData = new XMLSerializer().serializeToString(svgClone);
      
      // 새 이미지에 SVG 데이터 로드
      const img = new Image();
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      
      img.onload = () => {
        // 캔버스 생성
        const canvas = document.createElement('canvas');
        canvas.width = svgWidth;
        canvas.height = svgHeight;
        
        // 캔버스에 그리기
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          
          // PDF 생성
          const pdf = new jsPDF({
            orientation: svgWidth > svgHeight ? 'landscape' : 'portrait',
            unit: 'mm',
            format: 'a4'
          });
          
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          // 비율 계산
          const ratio = Math.min(pdfWidth / svgWidth, pdfHeight / svgHeight) * 0.9;
          
          // 중앙 정렬
          const imgX = (pdfWidth - svgWidth * ratio) / 2;
          const imgY = (pdfHeight - svgHeight * ratio) / 2;
          
          // PDF에 이미지 추가
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', imgX, imgY, svgWidth * ratio, svgHeight * ratio);
          pdf.save(generateFileName('pdf'));
        }
      };
      
      setIsOpen(false);
    } catch (error) {
      console.error('PDF 내보내기 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    }
  };

  // 형식에 따른 내보내기 함수 실행
  const handleExport = (format: ExportFormat) => {
    switch (format) {
      case 'png':
        exportAsPNG();
        break;
      case 'svg':
        exportAsSVG();
        break;
      case 'pdf':
        exportAsPDF();
        break;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-20 z-50 bg-black/20 dark:bg-white/20 backdrop-blur-md text-black dark:text-white p-3 rounded-full shadow-lg hover:bg-black/30 dark:hover:bg-white/30 transition-colors"
        aria-label="워드 클라우드 내보내기"
        title="워드 클라우드 내보내기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
        </svg>
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          className="fixed bottom-16 left-20 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-1">
            <button 
              onClick={() => handleExport('png')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white rounded transition-colors"
            >
              PNG로 내보내기
            </button>
            <button 
              onClick={() => handleExport('svg')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white rounded transition-colors"
            >
              SVG로 내보내기
            </button>
            <button 
              onClick={() => handleExport('pdf')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white rounded transition-colors"
            >
              PDF로 내보내기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton; 