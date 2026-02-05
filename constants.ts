import { DeviceConfig } from './types';

export const DEFAULT_URL = 'http://localhost:3000';

export const DEVICES: DeviceConfig[] = [
  {
    id: 'desktop-lg',
    name: 'Desktop Large',
    width: 1440,
    height: 900,
    type: 'desktop',
  },
  {
    id: 'tablet-ipad',
    name: 'iPad Pro',
    width: 834, // 11-inch portrait
    height: 1194,
    type: 'tablet',
  },
  {
    id: 'mobile-iphone',
    name: 'iPhone 14 Pro',
    width: 393,
    height: 852,
    type: 'mobile',
  },
  {
    id: 'mobile-android-small',
    name: 'Android Small',
    width: 360,
    height: 800,
    type: 'mobile',
  },
];

export const SYSTEM_INSTRUCTION = `
You are an expert Frontend Engineer and UI/UX Designer assisting a developer in reviewing responsive web applications.
Your goal is to help them identify issues with layout, spacing, typography, and functionality across different screen sizes.
When the user asks about CSS frameworks, assume Tailwind CSS unless specified otherwise.
Provide concise, actionable advice. If they paste code, analyze it for responsiveness pitfalls.
`;