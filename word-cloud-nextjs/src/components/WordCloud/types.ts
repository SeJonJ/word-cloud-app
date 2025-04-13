import { COLOR_THEMES, CLOUD_SHAPES } from './constants';

export interface WordData {
  text: string;
  value: number;
}

export interface CloudWord extends WordData {
  size: number;
  x: number;
  y: number;
  rotate: number;
}

export type ColorTheme = keyof typeof COLOR_THEMES;
export type CloudShape = typeof CLOUD_SHAPES[number];
export type RotationMode = 'none' | 'random' | 'degrees';
export type ControlPosition = 'left' | 'right';

export interface WordCloudConfig {
  minFontSize: number;
  maxFontSize: number;
  padding: number;
  colorTheme: ColorTheme;
  shape: CloudShape;
  rotationMode: RotationMode;
  rotationAngle: number;
}

export interface WordCloudProps {
  words: WordData[];
  width?: number;
  height?: number;
  shape?: CloudShape;
}

export interface WordCloudControls {
  config: WordCloudConfig;
  position: ControlPosition;
  onMinFontSizeChange: (value: number) => void;
  onMaxFontSizeChange: (value: number) => void;
  onPaddingChange: (value: number) => void;
  onColorThemeChange: (theme: ColorTheme) => void;
  onShapeChange: (shape: CloudShape) => void;
  onRotationModeChange: (mode: RotationMode) => void;
  onRotationAngleChange: (angle: number) => void;
}

export interface WordCloudData {
  words: CloudWord[];
  fontScale: (value: number) => number;
  colorScale: (value: number) => string;
} 