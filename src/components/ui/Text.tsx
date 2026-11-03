import React from 'react';
import { Text as RNText, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { ColorKey } from '@/theme/tokens';

type Variant = 'display' | 'title' | 'heading' | 'subheading' | 'body' | 'strong' | 'label';

const sizes: Record<Variant, number> = {
  display: 34,
  title: 26,
  heading: 22,
  subheading: 18,
  body: 16,
  strong: 16,
  label: 14,
};

type Props = TextProps & {
  variant?: Variant;
  color?: ColorKey;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
};

/** All text goes through here so fonts and colours follow the active theme. */
export function Text({ variant = 'body', color = 'text', align, style, ...rest }: Props) {
  const { colors, fonts } = useTheme();
  const isHeading = variant === 'display' || variant === 'title' || variant === 'heading';
  const fontFamily = isHeading ? fonts.heading : variant === 'body' ? fonts.body : fonts.strong;
  const size = sizes[variant];
  return (
    <RNText
      accessibilityRole={isHeading ? 'header' : undefined}
      {...rest}
      style={[
        {
          fontFamily,
          fontSize: size,
          lineHeight: Math.round(size * (isHeading ? 1.2 : 1.4)),
          color: colors[color],
          textAlign: align,
        },
        style,
      ]}
    />
  );
}
