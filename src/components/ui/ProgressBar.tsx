import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { ColorKey } from '@/theme/tokens';

type Props = {
  /** 0 to 1 */
  value: number;
  color?: ColorKey;
  height?: number;
  trackColor?: string;
  label: string;
};

export function ProgressBar({ value, color = 'primary', height = 10, trackColor, label }: Props) {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
      style={{ height, borderRadius: height / 2, backgroundColor: trackColor ?? colors.track, overflow: 'hidden' }}
    >
      <View style={{ width: `${pct * 100}%`, height: '100%', borderRadius: height / 2, backgroundColor: colors[color] }} />
    </View>
  );
}
