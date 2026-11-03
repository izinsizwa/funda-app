import { Redirect } from 'expo-router';
import React from 'react';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { features } from '@/config/features';

/**
 * Parent-to-tutor messages. Hidden until `features.tutorChat` is on, because
 * messages need the backend to be delivered.
 */
export default function Messages() {
  if (!features.tutorChat) return <Redirect href="/parent" />;
  return (
    <Screen>
      <Text variant="display">Messages</Text>
      <Card padding={16} shadow={0}>
        <Text color="muted">Messages to the tutor are not switched on yet.</Text>
      </Card>
    </Screen>
  );
}
