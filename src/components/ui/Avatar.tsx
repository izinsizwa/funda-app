import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { ColorKey } from '@/theme/tokens';
import { Text } from './Text';

type Props = {
  initial: string;
  tone: ColorKey;
  size?: number;
  borderWidth?: number;
};

export function Avatar({ initial, tone, size = 48, borderWidth }: Props) {
  const theme = useTheme();
  return (
    <View
      accessible={false}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.colors[tone],
        borderWidth: borderWidth ?? Math.min(theme.borderWidth, 3),
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        color="ink"
        style={{ fontFamily: theme.fonts.heading, fontSize: Math.round(size * 0.46), lineHeight: Math.round(size * 0.56) }}
      >
        {initial}
      </Text>
    </View>
  );
}
