import React from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  label: string;
};

export function Toggle({ value, onValueChange, label }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={8}
      onPress={() => onValueChange(!value)}
      style={{
        width: 56,
        height: 32,
        borderRadius: 16,
        padding: 3,
        justifyContent: 'center',
        alignItems: value ? 'flex-end' : 'flex-start',
        backgroundColor: value ? colors.primary : colors.track,
      }}
    >
      <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: colors.white }} />
    </Pressable>
  );
}
