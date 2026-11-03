import React from 'react';
import { Pressable } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

type Props = {
  label: string;
  selected?: boolean;
  /** Colour of a selected chip: the primary brand colour or the dark text colour. */
  selectedTone?: 'primary' | 'text';
  onPress?: () => void;
};

/** A pill you can tap: learner switcher, language choice, quick prompts. */
export function Chip({ label, selected, selectedTone = 'primary', onPress }: Props) {
  const theme = useTheme();
  const { colors } = theme;
  const selectedBg = selectedTone === 'text' ? colors.text : colors.primary;
  const selectedFg = selectedTone === 'text' ? colors.bg : colors.onPrimary;
  const unselectedBg = theme.kind === 'senior' ? colors.surfaceAlt : colors.surface;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => ({
        height: 44,
        paddingHorizontal: 18,
        justifyContent: 'center',
        borderRadius: theme.radius.pill,
        backgroundColor: selected ? selectedBg : unselectedBg,
        borderWidth: selected ? 0 : Math.min(theme.borderWidth, 2),
        borderColor: colors.border,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text variant="strong" style={{ color: selected ? selectedFg : colors.text, fontSize: 15 }}>
        {label}
      </Text>
    </Pressable>
  );
}
