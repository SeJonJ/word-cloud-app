export const COLOR_THEMES = {
  blue: ['#2196F3', '#64B5F6', '#90CAF9', '#1976D2', '#0D47A1'],
  red: ['#F44336', '#E57373', '#EF5350', '#D32F2F', '#B71C1C'],
  green: ['#4CAF50', '#81C784', '#66BB6A', '#388E3C', '#1B5E20'],
  purple: ['#9C27B0', '#BA68C8', '#AB47BC', '#7B1FA2', '#4A148C'],
} as const;

export const FONT_SIZE_RANGE = {
  min: 12,
  max: 120,
  default: {
    min: 20,
    max: 80,
  },
} as const;

export const PADDING_RANGE = {
  min: 1,
  max: 10,
  default: 5,
} as const;

export const ROTATION = {
  modes: ['none', 'random', 'degrees'] as const,
  angles: {
    min: 0,
    max: 90,
    default: 0,
  },
} as const;

export const DEBOUNCE_DELAY = 100;
export const ANIMATION_DURATION = 300;

export const DEFAULT_DIMENSIONS = {
  width: 1280,
  height: 720,
} as const;

export const CLOUD_SHAPES = ['circle', 'rectangle'] as const;

export const SHAPE_PARAMS = {
  circle: { radius: 0.45 },
  rectangle: { width: 0.8, height: 0.6 },
  triangle: { sideLength: 0.8 },
  star: { outerRadius: 0.45, innerRadius: 0.2, points: 5 }
} as const; 