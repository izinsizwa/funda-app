import React from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * Page wrapper: themed background, safe-area padding, and a centred column
 * that stays a comfortable width on tablets and PC browsers.
 */
export function Screen({ children, scroll = true, style }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const column: ViewStyle = {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: insets.top + 16,
    paddingBottom: 32,
    gap: 16,
  };

  if (!scroll) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <View style={[column, { flex: 1 }, style]}>{children}</View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={[column, style]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
