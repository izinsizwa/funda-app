import React from 'react';
import { View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import type { Profile } from '@/data/types';
import { masteryLabel } from '@/domain/progress';
import { useProgress } from '@/state/session';

/** Subject-by-subject progress for one learner. Subjects with no answers yet say "Not started". */
export function LearnerSubjects({ learner }: { learner: Profile }) {
  const { subjects } = useProgress(learner);
  return (
    <Card padding={16} innerStyle={{ gap: 12 }}>
      <Text variant="strong">{`${learner.name}'s subjects`}</Text>
      {subjects.map((s) => (
        <View key={s.id} style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{s.name}</Text>
            <Text variant="label" color="muted">
              {s.mastery === null ? masteryLabel(null) : `${masteryLabel(s.mastery)}, ${s.mastery}%`}
            </Text>
          </View>
          <ProgressBar
            value={(s.mastery ?? 0) / 100}
            color={s.mastery !== null && s.mastery < 60 ? 'coral' : 'primary'}
            label={`${learner.name} ${s.name}`}
          />
        </View>
      ))}
    </Card>
  );
}
