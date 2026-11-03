import type { TabTriggerSlotProps } from 'expo-router/ui';
import React from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

/** The floating bar that holds the tab buttons. Styled by the active theme. */
export function TabBar({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: theme.colors.bg,
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: Math.max(insets.bottom, 12),
      }}
    >
      <View
        accessibilityRole="tablist"
        style={{
          width: '100%',
          maxWidth: 560,
          alignSelf: 'center',
          height: 72,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingHorizontal: 6,
          borderRadius: theme.radius.card,
          backgroundColor: theme.colors.surface,
          borderWidth: theme.borderWidth,
          borderColor: theme.colors.border,
        }}
      >
        {children}
      </View>
    </View>
  );
}

type TabButtonProps = TabTriggerSlotProps & {
  label: string;
  icon: IconName;
};

/** One tab. expo-router's TabTrigger hands us `isFocused` and the press handlers. */
export function TabButton({ label, icon, isFocused, ...props }: TabButtonProps) {
  const theme = useTheme();
  const { colors } = theme;
  const senior = theme.kind === 'senior';
  const activeBg = senior ? colors.surfaceAlt : theme.kind === 'parent' ? colors.sunSoft : colors.sun;
  const activeFg = senior ? colors.sun : colors.ink;
  const inactiveFg = senior ? colors.muted : colors.text;
  const fg = isFocused ? activeFg : inactiveFg;

  return (
    <Pressable
      {...(props as unknown as PressableProps)}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!isFocused }}
      style={{
        minWidth: 72,
        height: 56,
        paddingHorizontal: 8,
        borderRadius: theme.radius.control,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        backgroundColor: isFocused ? activeBg : 'transparent',
      }}
    >
      <Icon name={icon} size={24} color={fg} />
      <Text variant="label" style={{ color: fg, fontSize: 13, lineHeight: 16, fontFamily: theme.fonts.strong }}>
        {label}
      </Text>
    </Pressable>
  );
}
