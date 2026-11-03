import React from 'react';
import { View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useSession } from '@/state/session';
import { gradeLabel } from '@/theme/bands';

/** Learner profiles and the ways to leave the parent area or sign out. */
export default function Settings() {
  const household = useSession((s) => s.household);
  const leaveProfile = useSession((s) => s.leaveProfile);
  const signOut = useSession((s) => s.signOut);
  const learners = household?.learners ?? [];

  return (
    <Screen>
      <Text variant="display">Settings</Text>

      <Card padding={16} innerStyle={{ gap: 14 }}>
        <Text variant="heading" style={{ fontSize: 20 }}>
          Learner profiles
        </Text>
        {learners.length === 0 ? <Text color="muted">No learners added yet.</Text> : null}
        {learners.map((l) => (
          <View key={l.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 }}>
            <Avatar initial={l.name.charAt(0)} tone={l.tone} size={48} />
            <View style={{ flex: 1 }}>
              <Text variant="strong">{l.name}</Text>
              <Text variant="label" color="muted">
                {gradeLabel(l.grade ?? 4)}
              </Text>
            </View>
          </View>
        ))}
        <Text variant="label" color="muted">
          Removing a learner will be done on the website, where your account is protected by your full login.
        </Text>
      </Card>

      <View style={{ gap: 12 }}>
        <Button label="Back to learners" variant="secondary" size="lg" fullWidth onPress={leaveProfile} />
        <Button label="Sign out" variant="ghost" size="md" fullWidth onPress={signOut} />
      </View>
    </Screen>
  );
}
