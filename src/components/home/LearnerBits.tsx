import React from 'react';
import { Pressable, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import type { Profile } from '@/data/types';
import { useSession } from '@/state/session';
import { gradeLabel } from '@/theme/bands';
import { useTheme } from '@/theme/ThemeProvider';

/** Avatar + name. Tapping it goes back to "Who is learning?" for the shared phone. */
export function SwitchLearner({ learner, showGrade }: { learner: Profile; showGrade?: boolean }) {
  const leaveProfile = useSession((s) => s.leaveProfile);
  return (
    <Pressable
      onPress={leaveProfile}
      accessibilityRole="button"
      accessibilityLabel={`Switch learner, now ${learner.name}`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48 }}
    >
      <Avatar initial={learner.name.charAt(0)} tone={learner.tone} size={48} />
      <View>
        <Text variant="heading" style={{ fontSize: 22 }}>
          {learner.name}
        </Text>
        {showGrade ? (
          <Text variant="label" color="muted">
            {gradeLabel(learner.grade ?? 4)}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

/** A section title used across the home screens. */
export function SectionTitle({ children }: { children: string }) {
  return (
    <Text variant="heading" style={{ fontSize: 22 }}>
      {children}
    </Text>
  );
}

/** Round badge with an icon and a caption, for the "My badges" row. */
export function BadgeItem({
  label,
  icon,
  tone,
}: {
  label: string;
  icon: 'flame' | 'star' | 'sun' | 'storybook';
  tone: 'sun' | 'teal' | 'coral' | 'lavenderStrong';
}) {
  const theme = useTheme();
  const fill = icon === 'flame' ? theme.colors.coral : icon === 'star' ? theme.colors.sun : theme.colors.white;
  return (
    <View accessible accessibilityLabel={`Badge: ${label}`} style={{ width: 76, alignItems: 'center', gap: 8 }}>
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: theme.colors[tone],
          borderWidth: Math.min(theme.borderWidth, 3),
          borderColor: theme.colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={icon} size={34} color={theme.colors.ink} fill={fill} strokeWidth={2} />
      </View>
      <Text variant="label" align="center" style={{ lineHeight: 17 }}>
        {label}
      </Text>
    </View>
  );
}
