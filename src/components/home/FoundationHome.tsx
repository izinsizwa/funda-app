import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { HearIt } from '@/components/ui/HearIt';
import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { Pill } from '@/components/ui/Pill';
import { Screen } from '@/components/ui/Screen';
import { Sticker } from '@/components/ui/Sticker';
import { StarRow } from '@/components/ui/StarRow';
import { Text } from '@/components/ui/Text';
import { foundationWorlds, lessonIdFor, worldLessons } from '@/content/lessons';
import type { World } from '@/data/types';
import { useLearner, useProgress } from '@/state/session';
import { useTheme } from '@/theme/ThemeProvider';
import { SwitchLearner } from './LearnerBits';

export function WorldTile({ world, onPress }: { world: World; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Sticker
      bg={theme.colors[world.tone]}
      radius={theme.radius.card}
      onPress={onPress}
      accessibilityLabel={`${world.label} world`}
      innerStyle={{ height: 150, alignItems: 'center', justifyContent: 'center', gap: 8 }}
    >
      {world.glyph ? (
        <Text
          color="ink"
          style={{ fontFamily: theme.fonts.heading, fontSize: 44, lineHeight: 50, letterSpacing: 2 }}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {world.glyph}
        </Text>
      ) : (
        <Icon name={world.icon ?? 'book'} size={50} color={theme.colors.ink} fill={theme.colors.white} strokeWidth={1.8} />
      )}
      <Text color="ink" style={{ fontFamily: theme.fonts.heading, fontSize: 24, lineHeight: 28 }}>
        {world.label}
      </Text>
    </Sticker>
  );
}

/** Grade R-3: huge buttons, one clear action, voice help, no numbers to compare. */
export function FoundationHome() {
  const router = useRouter();
  const learner = useLearner();
  const progress = useProgress(learner);
  const stars = progress.stars;
  const starsToday = Math.min(5, progress.starsToday);

  const greeting = `Sawubona, ${learner.name}! Ready to play?`;
  const spokenGreeting = `Hello ${learner.name}! Are you ready to play?`;

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <SwitchLearner learner={learner} />
        <View accessible accessibilityLabel={`${stars} stars collected`}>
          <Pill label={String(stars)} icon="star" iconFill="sun" kind="stat" />
        </View>
      </View>

      <Card padding={16} innerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Mascot size={96} />
        <View style={{ flex: 1, gap: 8, alignItems: 'flex-start' }}>
          <Text variant="heading" style={{ fontSize: 24 }}>
            {greeting}
          </Text>
          <HearIt text={spokenGreeting} />
        </View>
      </Card>

      <Button
        label="Let's learn!"
        size="xl"
        fullWidth
        icon="play"
        onPress={() => router.push(`/lesson/${lessonIdFor(learner.grade ?? 0)}`)}
      />

      <Text variant="heading" style={{ fontSize: 24 }}>
        Pick a world
      </Text>
      <Grid columns={2} gap={16}>
        {foundationWorlds.map((world) => (
          <WorldTile key={world.id} world={world} onPress={() => router.push(`/lesson/${worldLessons[world.id]}`)} />
        ))}
      </Grid>

      <Card padding={14} innerStyle={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="heading" style={{ fontSize: 20 }}>
            Today's stars
          </Text>
          <Text variant="strong" color="muted">{`${starsToday} of 5`}</Text>
        </View>
        <StarRow filled={starsToday} />
      </Card>
    </Screen>
  );
}
