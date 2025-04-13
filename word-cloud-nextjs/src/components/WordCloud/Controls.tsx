import React, { useState } from 'react';
import { COLOR_THEMES, FONT_SIZE_RANGE, PADDING_RANGE, CLOUD_SHAPES, ROTATION } from './constants';
import { WordCloudControls, ColorTheme, CloudShape, RotationMode, ControlPosition } from './types';

const Controls: React.FC<WordCloudControls> = ({
  config,
  position,
  onMinFontSizeChange,
  onMaxFontSizeChange,
  onPaddingChange,
  onColorThemeChange,
  onShapeChange,
  onRotationModeChange,
  onRotationAngleChange,
}) => {
  // 패널 접기 기능
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // readonly 배열을 변환
  const rotationModes: RotationMode[] = ['none', 'random', 'degrees'];
  
  return (
    <div 
      className={`fixed bottom-4 right-4 bg-black/20 dark:bg-white/20 backdrop-blur-md rounded-lg shadow-lg text-black dark:text-white
                  max-h-[90vh] overflow-y-auto transition-all duration-300 z-50
                  ${isCollapsed ? 'w-12 p-2' : 'w-[280px] p-4'}`}
    >
      {/* 접기/펼치기 버튼 */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center 
                  bg-black/30 dark:bg-white/30 hover:bg-black/50 dark:hover:bg-white/50 rounded-full transition-colors"
        title={isCollapsed ? "설정 패널 열기" : "설정 패널 닫기"}
      >
        {isCollapsed ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            {/* <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/> */}
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
          </svg>
        )}
      </button>

      {/* 패널이 접혀있을 때 표시할 아이콘 */}
      {isCollapsed && (
        <div className="flex justify-center items-center h-8 mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
          </svg>
        </div>
      )}
      
      {!isCollapsed && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Min Font Size: {config.minFontSize}px
            </label>
            <input
              type="range"
              min={FONT_SIZE_RANGE.min}
              max={FONT_SIZE_RANGE.max}
              value={config.minFontSize}
              onChange={(e) => onMinFontSizeChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Max Font Size: {config.maxFontSize}px
            </label>
            <input
              type="range"
              min={FONT_SIZE_RANGE.min}
              max={FONT_SIZE_RANGE.max}
              value={config.maxFontSize}
              onChange={(e) => onMaxFontSizeChange(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Padding: {config.padding}px
            </label>
            <input
              type="range"
              min={PADDING_RANGE.min}
              max={PADDING_RANGE.max}
              value={config.padding}
              onChange={(e) => onPaddingChange(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Color Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(COLOR_THEMES) as ColorTheme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => onColorThemeChange(theme)}
                  className={`px-3 py-1 rounded capitalize ${
                    config.colorTheme === theme
                      ? 'bg-white dark:bg-gray-800 text-black dark:text-white'
                      : 'bg-black/20 dark:bg-white/20 hover:bg-black/30 dark:hover:bg-white/30'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Shape</label>
            <div className="grid grid-cols-2 gap-2">
              {CLOUD_SHAPES.map((shape) => (
                <button
                  key={shape}
                  onClick={() => onShapeChange(shape)}
                  className={`px-3 py-1 rounded capitalize ${
                    config.shape === shape
                      ? 'bg-white dark:bg-gray-800 text-black dark:text-white'
                      : 'bg-black/20 dark:bg-white/20 hover:bg-black/30 dark:hover:bg-white/30'
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>

          {/* 회전 모드 선택 */}
          <div>
            <label className="block text-sm font-medium mb-2">Rotation</label>
            <div className="grid grid-cols-3 gap-2">
              {rotationModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => onRotationModeChange(mode)}
                  className={`px-3 py-1 rounded capitalize ${
                    config.rotationMode === mode
                      ? 'bg-white dark:bg-gray-800 text-black dark:text-white'
                      : 'bg-black/20 dark:bg-white/20 hover:bg-black/30 dark:hover:bg-white/30'
                  }`}
                >
                  {mode === 'none' ? 'None' : 
                  mode === 'random' ? 'Random' : 
                  'Fixed'}
                </button>
              ))}
            </div>
          </div>

          {/* 회전 각도 선택 (rotationMode가 'degrees'일 때만 표시) */}
          {config.rotationMode === 'degrees' && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Angle: {config.rotationAngle}°
              </label>
              <input
                type="range"
                min={ROTATION.angles.min}
                max={ROTATION.angles.max}
                value={config.rotationAngle}
                onChange={(e) => onRotationAngleChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Controls; 