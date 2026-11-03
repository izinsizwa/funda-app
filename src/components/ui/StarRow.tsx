import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Icon } from './Icon';

type Props = {
  total?: number;
  filled: number;
  size?: number;
};

export function StarRow({ total = 5, filled, size = 36 }: Props) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${filled} of ${total} stars`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
    >
      {Array.from({ length: total }, (_, i) => (
        <Icon
          key={i}
          name="star"
          size={size}
          color={colors.ink}
          fill={i < filled ? colors.sun : colors.surface}
          strokeWidth={2}
        />
      ))}
    </View>
  );
}
