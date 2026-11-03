import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { WorldTile } from '@/components/home/FoundationHome';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { foundationWorlds, lessonForSubject, worldLessons } from '@/content/lessons';
import { masteryLabel } from '@/domain/progress';
import { useBand, useLearner, useProgress } from '@/state/session';

/** Everything to learn. Foundation sees big worlds; older learners see their subjects. */
export default function Learn() {
  const router = useRouter();
  const band = useBand();
  const learner = useLearner();
  const progress = useProgress(learner);

  if (band === 'foundation') {
    return (
      <Screen>
        <Text variant="display">Pick a world</Text>
        <Grid columns={2} gap={16}>
          {foundationWorlds.map((world) => (
            <WorldTile key={world.id} world={world} onPress={() => router.push(`/lesson/${worldLessons[world.id]}`)} />
          ))}
        </Grid>
      </Screen>
    );
  }

  const subjects = progress.subjects;
  return (
    <Screen>
      <Text variant="display">Learn</Text>
      <Text color="muted">Subjects for your grade.</Text>
      <View style={{ gap: 12 }}>
        {subjects.map((s) => {
          const lesson = lessonForSubject(s.id);
          return (
            <Card key={s.id} padding={16} shadow={0} innerStyle={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="heading" style={{ fontSize: 20 }}>
                  {s.name}
                </Text>
                <Text variant="label" color="muted">
                  {masteryLabel(s.mastery)}
                </Text>
              </View>
              <ProgressBar value={(s.mastery ?? 0) / 100} color={s.mastery !== null && s.mastery < 60 ? 'coral' : 'primary'} label={`${s.name} progress`} />
              {lesson ? (
                <Button
                  label={lesson.title}
                  variant="primary"
                  size="sm"
                  icon="play"
                  onPress={() => router.push(`/lesson/${lesson.id}`)}
                />
              ) : (
                <Text variant="label" color="muted">
                  Lessons for this subject are coming soon.
                </Text>
              )}
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
