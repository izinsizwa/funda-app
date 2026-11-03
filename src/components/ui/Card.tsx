import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { ColorKey } from '@/theme/tokens';
import { Sticker } from './Sticker';

type Props = {
  tone?: ColorKey;
  padding?: number;
  radius?: number;
  /** Override the theme's shadow depth (use 0 for a flat card). */
  shadow?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export function Card({
  tone = 'surface',
  padding = 16,
  radius,
  shadow,
  onPress,
  accessibilityLabel,
  style,
  innerStyle,
  children,
}: Props) {
  const theme = useTheme();
  return (
    <Sticker
      bg={theme.colors[tone]}
      radius={radius ?? theme.radius.card}
      shadow={shadow}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={style}
      innerStyle={[{ padding }, innerStyle]}
    >
      {children}
    </Sticker>
  );
}
