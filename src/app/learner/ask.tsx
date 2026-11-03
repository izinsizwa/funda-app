import { Redirect } from 'expo-router';
import React from 'react';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { features } from '@/config/features';
import { useBand } from '@/state/session';

/**
 * The tutor chat. The tab is hidden until `features.tutorChat` is on, because
 * the real tutor runs on the server and there is nothing to talk to yet.
 * Learners who somehow land here are sent home.
 */
export default function Ask() {
  const band = useBand();
  if (band === 'foundation' || !features.tutorChat) return <Redirect href="/learner" />;

  return (
    <Screen>
      <Text variant="display">{band === 'intermediate' ? 'Ask Funi' : 'Tutor'}</Text>
      <Card padding={16} shadow={0}>
        <Text color="muted">The tutor chat connects to our server. It is not switched on yet.</Text>
      </Card>
    </Screen>
  );
}
