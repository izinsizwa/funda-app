import React from 'react';
import { View } from 'react-native';

import { ReportCard } from '@/components/parent/ReportCard';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useSession } from '@/state/session';
import { LearnerSubjects } from '@/components/parent/LearnerSubjects';

/** One report per child, each with subject-by-subject progress underneath. */
export default function Reports() {
  const household = useSession((s) => s.household);
  const learners = household?.learners ?? [];

  if (learners.length === 0) {
    return (
      <Screen>
        <Text variant="display">Reports</Text>
        <Text color="muted">Add a learner on the Home tab and their reports will show here.</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text variant="display">Reports</Text>
      <Text color="muted">How each learner is doing, from the lessons they finish.</Text>

      {learners.map((learner) => (
        <View key={learner.id} style={{ gap: 12 }}>
          <ReportCard learner={learner} />
          <LearnerSubjects learner={learner} />
        </View>
      ))}
    </Screen>
  );
}
