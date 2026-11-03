import React from 'react';
import { Pressable, View, type AccessibilityRole, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  bg: string;
  radius: number;
  borderColor?: string;
  borderWidth?: number;
  /** Height of the flat shadow strip under the box. Defaults to the theme's. */
  shadow?: number;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: { selected?: boolean; checked?: boolean; disabled?: boolean };
  children?: React.ReactNode;
};

/**
 * The "sticker" look for kid themes: a bordered box with a flat shadow
 * underneath. Works the same on iOS, Android and web (no platform shadows).
 * In the calmer themes the shadow is 0 and this is just a bordered box.
 */
export function Sticker({
  bg,
  radius,
  borderColor,
  borderWidth,
  shadow,
  onPress,
  disabled,
  style,
  innerStyle,
  accessibilityLabel,
  accessibilityRole,
  accessibilityState,
  children,
}: Props) {
  const theme = useTheme();
  const depth = shadow ?? theme.shadow;
  const outer: ViewStyle = {
    borderRadius: radius,
    backgroundColor: depth > 0 ? theme.colors.border : 'transparent',
    paddingBottom: depth,
  };
  const inner = (pressed: boolean): ViewStyle => ({
    backgroundColor: bg,
    borderRadius: radius,
    borderWidth: borderWidth ?? theme.borderWidth,
    borderColor: borderColor ?? theme.colors.border,
    transform: [{ translateY: pressed ? Math.min(3, depth) : 0 }],
    opacity: disabled ? 0.5 : 1,
  });

  if (!onPress) {
    return (
      <View style={[outer, style]}>
        <View style={[inner(false), innerStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={accessibilityRole ?? 'button'}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState ?? { disabled: !!disabled }}
      style={[outer, style]}
    >
      {({ pressed }) => <View style={[inner(pressed), innerStyle]}>{children}</View>}
    </Pressable>
  );
}
