import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useSession } from '@/state/session';
import { gradeLabel } from '@/theme/bands';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Shared-phone friendly: in many homes one phone serves several children.
 * Tapping a picture sets the active profile, which sets the theme and routes.
 */
export default function WhoIsLearning() {
  const router = useRouter();
  const theme = useTheme();
  const household = useSession((s) => s.household);
  const selectLearner = useSession((s) => s.selectLearner);
  const learners = household?.learners.filter((l) => l.role === 'learner') ?? [];

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Mascot size={56} />
        <Text variant="heading">Funda KZN Hub</Text>
      </View>

      <View style={{ gap: 8, marginTop: 8 }}>
        <Text variant="display">Who is learning today?</Text>
        <Text variant="subheading" color="muted">
          Tap your picture to start.
        </Text>
      </View>

      <View style={{ gap: 16 }}>
        {learners.length === 0 ? (
          <Card padding={16}>
            <Text variant="heading" style={{ fontSize: 20 }}>
              No learners yet
            </Text>
            <Text color="muted">A grown-up can add the first learner in the parent area.</Text>
          </Card>
        ) : null}
        {learners.map((learner) => (
          <Card
            key={learner.id}
            onPress={() => selectLearner(learner.id)}
            accessibilityLabel={`${learner.name}, ${gradeLabel(learner.grade ?? 4)}`}
            padding={12}
            innerStyle={{ minHeight: 96, flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16 }}
          >
            <Avatar initial={learner.name.charAt(0)} tone={learner.tone} size={64} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="title" style={{ fontSize: 26 }}>
                {learner.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text color="muted">{gradeLabel(learner.grade ?? 4)}</Text>
              </View>
            </View>
            <Icon name="chevronRight" size={28} color={theme.colors.text} strokeWidth={2.4} />
          </Card>
        ))}

        <Pressable
          onPress={() => router.push('/parent-pin')}
          accessibilityRole="button"
          accessibilityLabel="Add a learner (parent area)"
          style={{
            minHeight: 80,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            paddingHorizontal: 16,
            borderRadius: theme.radius.card,
            borderWidth: theme.borderWidth,
            borderStyle: 'dashed',
            borderColor: theme.colors.border,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: theme.colors.surface,
              borderWidth: theme.borderWidth,
              borderColor: theme.colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="plus" size={24} color={theme.colors.text} strokeWidth={2.6} />
          </View>
          <Text variant="heading">Add a learner</Text>
        </Pressable>
      </View>

      <View style={{ gap: 8, alignItems: 'center', marginTop: 12 }}>
        <Button
          label="Parent area"
          variant="secondary"
          size="md"
          fullWidth
          icon="lock"
          onPress={() => router.push('/parent-pin')}
        />
        <Text variant="label" color="muted">
          Ask a grown-up to open this.
        </Text>
      </View>
    </Screen>
  );
}
