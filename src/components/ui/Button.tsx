import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Icon, type IconName } from './Icon';
import { Sticker } from './Sticker';
import { Text } from './Text';

type Variant = 'primary' | 'accent' | 'teal' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg' | 'xl';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  /** Fully rounded ends, for chips and small actions. */
  pill?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const heights: Record<Size, number> = { sm: 44, md: 52, lg: 60, xl: 88 };
const fontSizes: Record<Size, number> = { sm: 15, md: 16, lg: 20, xl: 30 };

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth,
  pill,
  disabled,
  accessibilityLabel,
  style,
}: Props) {
  const theme = useTheme();
  const { colors } = theme;
  const flat = theme.shadow === 0;

  const palette = {
    primary: { bg: colors.primary, fg: colors.onPrimary },
    accent: { bg: colors.sun, fg: colors.ink },
    teal: { bg: colors.teal, fg: colors.ink },
    secondary: { bg: colors.surface, fg: colors.text },
    ghost: { bg: 'transparent', fg: colors.text },
  }[variant];

  const outlined = variant === 'secondary' || variant === 'ghost';
  const borderColor = outlined ? colors.outline : flat ? palette.bg : colors.border;
  const height = size === 'sm' ? heights.sm : Math.max(heights[size], theme.minTap);
  const radius = pill ? theme.radius.pill : size === 'xl' ? theme.radius.card : theme.radius.control;
  const depth = variant === 'ghost' ? 0 : size === 'sm' ? Math.min(theme.shadow, 3) : theme.shadow;
  const kidHeading = !flat && (size === 'lg' || size === 'xl');
  const fontSize = fontSizes[size];

  const iconNode = icon ? (
    <Icon
      name={icon}
      size={size === 'xl' ? 34 : size === 'sm' ? 20 : 22}
      color={palette.fg}
      fill={icon === 'play' ? palette.fg : 'none'}
    />
  ) : null;

  return (
    <Sticker
      bg={palette.bg}
      radius={radius}
      borderColor={borderColor}
      shadow={depth}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? label}
      style={[fullWidth ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' }, style]}
      innerStyle={{ height, paddingHorizontal: size === 'sm' ? 16 : 20, justifyContent: 'center' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        {iconPosition === 'left' ? iconNode : null}
        <Text
          color="text"
          style={{
            color: palette.fg,
            fontFamily: kidHeading ? theme.fonts.heading : theme.fonts.strong,
            fontSize,
            lineHeight: Math.round(fontSize * 1.2),
          }}
        >
          {label}
        </Text>
        {iconPosition === 'right' ? iconNode : null}
      </View>
    </Sticker>
  );
}
