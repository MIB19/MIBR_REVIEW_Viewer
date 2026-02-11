import { DeviceConfig } from './types';

export const DEFAULT_URL = 'https://example.com';

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