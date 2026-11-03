import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useSession } from '@/state/session';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'] as const;

/**
 * A PIN keeps small hands out of the parent area. It is a convenience gate:
 * anything that matters (plan changes, deleting a learner) is re-checked by
 * the server / website behind the parent's real login.
 */
function PinPad() {
  const router = useRouter();
  const theme = useTheme();
  const unlockParent = useSession((s) => s.unlockParent);
  const createParentPin = useSession((s) => s.createParentPin);
  const hasPin = useSession((s) => s.parentPin !== null);
  // First time: make a PIN (twice). After that: just enter it.
  const [step, setStep] = useState<'enter' | 'create' | 'confirm'>(hasPin ? 'enter' : 'create');
  const [firstPin, setFirstPin] = useState('');
  const [pin, setPin] = useState('');
  const [wrong, setWrong] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const press = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setWrong(false);
    setPin(next);
    if (next.length === 4) {
      const fail = () => {
        setWrong(true);
        timer.current = setTimeout(() => setPin(''), 350);
      };
      if (step === 'enter') {
        if (!unlockParent(next)) fail();
        // When it works, the session has the parent profile and the router moves on by itself.
      } else if (step === 'create') {
        setFirstPin(next);
        setStep('confirm');
        setPin('');
      } else if (next === firstPin) {
        createParentPin(next);
        unlockParent(next);
      } else {
        setStep('create');
        setFirstPin('');
        fail();
      }
    }
  };

  const back = () => {
    setWrong(false);
    setPin((p) => p.slice(0, -1));
  };

  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: 10, marginTop: 8 }}>
        <Icon name="lock" size={40} color={theme.colors.text} />
        <Text variant="title" align="center">
          {step === 'enter' ? 'Parent area' : 'Make a parent PIN'}
        </Text>
        <Text color="muted" align="center">
          {step === 'enter'
            ? 'Enter your 4-digit PIN.'
            : step === 'create'
              ? 'Choose 4 numbers only a grown-up knows.'
              : 'Type the same 4 numbers again.'}
        </Text>
      </View>

      <View
        accessible
        accessibilityLabel={`${pin.length} of 4 digits entered`}
        style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginVertical: 8 }}
      >
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: wrong ? '#C0392B' : theme.colors.outline,
              backgroundColor: i < pin.length ? (wrong ? '#C0392B' : theme.colors.text) : 'transparent',
            }}
          />
        ))}
      </View>

      <View style={{ height: 22, alignItems: 'center' }}>
        {wrong ? (
          <Text color="text" align="center" style={{ color: '#C0392B' }} accessibilityLiveRegion="polite">
            {step === 'enter' ? 'That PIN is not right. Try again.' : 'Those did not match. Start again.'}
          </Text>
        ) : null}
      </View>

      <View style={{ alignSelf: 'center', width: 264, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {KEYS.map((key, i) =>
          key === '' ? (
            <View key={i} style={{ width: 72, height: 72 }} />
          ) : (
            <Pressable
              key={i}
              onPress={() => (key === 'del' ? back() : press(key))}
              accessibilityRole="button"
              accessibilityLabel={key === 'del' ? 'Delete last digit' : key}
              style={({ pressed }) => ({
                width: 72,
                height: 72,
                borderRadius: 36,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: pressed ? theme.colors.sunSoft : theme.colors.surface,
                borderWidth: theme.borderWidth,
                borderColor: theme.colors.border,
              })}
            >
              {key === 'del' ? (
                <Icon name="close" size={26} color={theme.colors.text} />
              ) : (
                <Text variant="title">{key}</Text>
              )}
            </Pressable>
          ),
        )}
      </View>

      <View style={{ alignItems: 'center', gap: 12, marginTop: 8 }}>
        <Button label="Cancel" variant="ghost" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

export default function ParentPin() {
  return (
    <ThemeProvider kind="parent">
      <PinPad />
    </ThemeProvider>
  );
}
