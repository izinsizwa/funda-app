import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { BadgeItem, SectionTitle } from '@/components/home/LearnerBits';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';
import { Screen } from '@/components/ui/Screen';
import { StarRow } from '@/components/ui/StarRow';
import { Text } from '@/components/ui/Text';
import { useBand, useLearner, useProgress, useSession } from '@/state/session';
import { gradeLabel } from '@/theme/bands';

/** Learner profile: streak, badges or stars, and the two ways out (switch learner, parent area). */
export default function Me() {
  const router = useRouter();
  const band = useBand();
  const learner = useLearner();
  const progress = useProgress(learner);
  const leaveProfile = useSession((s) => s.leaveProfile);

  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: 10 }}>
        <Avatar initial={learner.name.charAt(0)} tone={learner.tone} size={96} borderWidth={3} />
        <Text variant="display">{learner.name}</Text>
        <Text color="muted">{gradeLabel(learner.grade ?? 4)}</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Pill label={`${progress.streak} day streak`} icon="flame" iconFill="coral" kind="stat" />
          {band === 'foundation' ? (
            <Pill label={`${progress.stars} stars`} icon="star" iconFill="sun" kind="stat" />
          ) : (
            <Pill label={`Level ${progress.level}`} kind="stat" />
          )}
        </View>
      </View>

      {band === 'foundation' ? (
        <>
          <SectionTitle>My stars today</SectionTitle>
          <Card padding={16} shadow={0}>
            <StarRow filled={Math.min(5, progress.starsToday)} />
          </Card>
        </>
      ) : (
        <>
          <SectionTitle>My badges</SectionTitle>
          {progress.badges.length === 0 ? (
            <Text color="muted">Finish a lesson to earn your first badge.</Text>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {progress.badges.map((b) => (
                <BadgeItem key={b.id} label={b.label} icon={b.icon} tone={b.tone} />
              ))}
            </View>
          )}
        </>
      )}

      <View style={{ gap: 12, marginTop: 8 }}>
        <Button label="Switch learner" variant="secondary" size="lg" fullWidth onPress={leaveProfile} />
        <Button label="Parent area" variant="ghost" size="md" fullWidth icon="lock" onPress={() => router.push('/parent-pin')} />
      </View>
    </Screen>
  );
}
