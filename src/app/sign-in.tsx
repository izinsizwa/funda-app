import React, { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Mascot } from '@/components/ui/Mascot';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useSession } from '@/state/session';

/**
 * The PARENT starts here, once. Learners never type anything:
 * they pick their picture on the next screen.
 */
export default function SignIn() {
  const signIn = useSession((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const res = signIn(email);
    setError(res.ok ? null : res.error);
  };

  return (
    <Screen style={{ paddingTop: 48 }}>
      <View style={{ alignItems: 'center', gap: 12 }}>
        <Mascot size={110} />
        <Text variant="display" align="center">
          Funda KZN Hub
        </Text>
        <Text align="center" color="muted">
          Smart learning. Real results.
        </Text>
      </View>

      <View style={{ gap: 14, marginTop: 8 }}>
        <Field
          label="Parent email"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setError(null);
          }}
          onSubmitEditing={submit}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="you@example.com"
        />
      </View>

      {error ? (
        <Text accessibilityLiveRegion="polite" style={{ color: '#C0392B' }}>
          {error}
        </Text>
      ) : null}

      <Button label="Get started" size="lg" fullWidth onPress={submit} />

      <Text variant="label" color="muted" align="center">
        Your learners and their progress are kept on this phone for now. Online accounts are coming soon.
      </Text>
    </Screen>
  );
}
