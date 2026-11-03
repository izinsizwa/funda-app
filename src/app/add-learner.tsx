import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { MAX_GRADE, MAX_NAME_LENGTH, MIN_GRADE } from '@/domain/household';
import { useSession } from '@/state/session';
import { gradeLabel } from '@/theme/bands';

const GRADES = Array.from({ length: MAX_GRADE - MIN_GRADE + 1 }, (_, i) => MIN_GRADE + i);

/** Add a learner: a first name and a grade. The grade decides how the app looks for them. */
export default function AddLearner() {
  const router = useRouter();
  const addLearner = useSession((s) => s.addLearner);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    if (grade === null) {
      setError('Please choose a grade.');
      return;
    }
    const res = addLearner({ name, grade });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.back();
  };

  return (
    <Screen>
      <Text variant="display">Add a learner</Text>
      <Field
        label="First name"
        value={name}
        onChangeText={(t) => {
          setName(t);
          setError(null);
        }}
        maxLength={MAX_NAME_LENGTH}
        autoCapitalize="words"
        placeholder="Learner's first name"
      />
      <View style={{ gap: 8 }}>
        <Text variant="strong">Grade</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {GRADES.map((g) => (
            <Chip
              key={g}
              label={gradeLabel(g)}
              selected={grade === g}
              onPress={() => {
                setGrade(g);
                setError(null);
              }}
            />
          ))}
        </View>
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={{ color: '#C0392B' }}>
          {error}
        </Text>
      ) : null}
      <Button label="Save learner" size="lg" fullWidth onPress={save} />
      <Button label="Cancel" variant="ghost" onPress={() => router.back()} />
    </Screen>
  );
}
