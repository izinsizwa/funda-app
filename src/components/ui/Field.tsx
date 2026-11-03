import React from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Text } from './Text';

type Props = TextInputProps & { label: string };

/** A labelled text box. The label is always visible and read by screen readers. */
export function Field({ label, style, ...rest }: Props) {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <View style={{ gap: 6 }}>
      <Text variant="strong">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        {...rest}
        style={[
          {
            height: Math.max(52, theme.minTap),
            paddingHorizontal: 16,
            borderRadius: theme.radius.control,
            borderWidth: Math.min(theme.borderWidth, 2),
            borderColor: colors.border,
            backgroundColor: colors.surface,
            color: colors.text,
            fontFamily: theme.fonts.body,
            fontSize: 17,
          },
          style,
        ]}
      />
    </View>
  );
}
