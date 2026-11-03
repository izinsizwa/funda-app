import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { ColorKey } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type Props = {
  label: string;
  icon?: IconName;
  /** Solid fill for the icon, e.g. a coral flame. */
  iconFill?: ColorKey;
  tone?: ColorKey;
  /** "stat" is the tall outlined pill used for streaks; "tag" is a small label. */
  kind?: 'stat' | 'tag';
};

export function Pill({ label, icon, iconFill, tone, kind = 'tag' }: Props) {
  const theme = useTheme();
  const { colors } = theme;
  const isStat = kind === 'stat';
  const bg = tone ? colors[tone] : isStat ? colors.surface : colors.sunSoft;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        height: isStat ? 44 : 28,
        paddingHorizontal: isStat ? 14 : 10,
        borderRadius: theme.radius.pill,
        backgroundColor: bg,
        borderWidth: isStat ? Math.min(theme.borderWidth, 2) : 0,
        borderColor: colors.outline,
      }}
    >
      {icon ? (
        <Icon
          name={icon}
          size={isStat ? 22 : 16}
          color={isStat ? colors.text : colors.ink}
          fill={iconFill ? colors[iconFill] : 'none'}
          strokeWidth={2}
        />
      ) : null}
      <Text variant={isStat ? 'strong' : 'label'} color={isStat ? 'text' : 'ink'}>
        {label}
      </Text>
    </View>
  );
}
