export interface DeviceConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  type: 'desktop' | 'tablet' | 'mobile';
  icon?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum ViewMode {
  ALL = 'ALL',
  FOCUS = 'FOCUS',
}

export type ThemeType = 'cyber' | 'lab';