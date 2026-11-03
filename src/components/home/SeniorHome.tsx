import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Pill } from '@/components/ui/Pill';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { features } from '@/config/features';
import { lessonForSubject, lessonIdFor, lessons } from '@/content/lessons';
import { focusAreas } from '@/domain/progress';
import { useLearner, useProgress } from '@/state/session';
import { useTheme } from '@/theme/ThemeProvider';
import { SectionTitle, SwitchLearner } from './LearnerBits';

const QUICK_PROMPTS = ['Explain simply', 'Test me', 'Past paper question'] as const;

/** Grade 7-9: calmer and denser, no cartoon styling, exam and tutor focused. */
export function SeniorHome() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const learner = useLearner();
  const [question, setQuestion] = useState('');
  const progress = useProgress(learner);
  const focus = focusAreas(progress.subjects);
  const nextLesson = lessons[lessonIdFor(learner.grade ?? 7)];

  const ask = (prompt: string) => {
    const text = prompt.trim();
    if (!text) return;
    setQuestion('');
    router.push({ pathname: '/learner/ask', params: { prompt: text } });
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <SwitchLearner learner={learner} showGrade />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pill label={String(progress.streak)} icon="flame" iconFill="sun" kind="stat" />
        </View>
      </View>

      <Card padding={20} innerStyle={{ gap: 6 }}>
        <Text variant="label" color="teal">
          Next lesson
        </Text>
        <Text variant="heading">{nextLesson.title}</Text>
        <Text color="muted" style={{ marginBottom: 8 }}>
          {nextLesson.subject}
        </Text>
        <Button
          label="Start"
          variant="teal"
          fullWidth
          icon="arrowRight"
          iconPosition="right"
          onPress={() => router.push(`/lesson/${nextLesson.id}`)}
        />
      </Card>

      <SectionTitle>Focus areas</SectionTitle>
      {focus.length === 0 ? (
        <Card padding={16} shadow={0}>
          <Text color="muted">Finish a lesson and the subjects that need practice will show here.</Text>
        </Card>
      ) : (
        <Card padding={0} innerStyle={{ paddingHorizontal: 16 }}>
          {focus.map((area, i) => (
            <View
              key={area.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                minHeight: 72,
                borderTopWidth: i === 0 ? 0 : 1,
                borderTopColor: colors.border,
              }}
            >
              <View style={{ flex: 1, gap: 6 }}>
                <Text variant="strong">{area.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <ProgressBar value={area.mastery / 100} color="coral" height={8} label={`${area.name} mastery`} />
                  </View>
                  <Text variant="label" color="muted">{`${area.mastery}%`}</Text>
                </View>
              </View>
              <Button
                label="Practise"
                variant="secondary"
                size="sm"
                onPress={() => router.push(`/lesson/${(lessonForSubject(area.id) ?? nextLesson).id}`)}
                accessibilityLabel={`Practise ${area.name}`}
                style={{ alignSelf: 'center' }}
              />
            </View>
          ))}
        </Card>
      )}

      <SectionTitle>Coming up</SectionTitle>
      <Card padding={16} shadow={0}>
        <Text color="muted">Nothing scheduled yet. Classes and quizzes from your tutor will show here.</Text>
      </Card>

      {features.tutorChat ? (
        <>
      <SectionTitle>Ask your tutor</SectionTitle>
      <Card padding={16} innerStyle={{ gap: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            minHeight: 52,
            paddingLeft: 14,
            paddingRight: 6,
            borderRadius: theme.radius.control,
            backgroundColor: colors.bg,
            borderWidth: 1,
            borderColor: colors.outline,
          }}
        >
          <Icon name="sparkle" size={22} color={colors.sun} strokeWidth={2} />
          <TextInput
            value={question}
            onChangeText={setQuestion}
            onSubmitEditing={() => ask(question)}
            returnKeyType="send"
            accessibilityLabel="Ask your tutor a question"
            placeholder="Ask anything about your Maths"
            placeholderTextColor={colors.muted}
            style={{ flex: 1, minWidth: 0, height: 44, color: colors.text, fontFamily: theme.fonts.body, fontSize: 16 }}
          />
          <Pressable
            onPress={() => ask(question)}
            accessibilityRole="button"
            accessibilityLabel="Send question"
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.sun,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="arrowRight" size={20} color={colors.ink} strokeWidth={2.4} />
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {QUICK_PROMPTS.map((p) => (
            <Pressable
              key={p}
              onPress={() => ask(p)}
              accessibilityRole="button"
              accessibilityLabel={p}
              style={({ pressed }) => ({
                height: 44,
                paddingHorizontal: 16,
                justifyContent: 'center',
                borderRadius: 22,
                backgroundColor: colors.surfaceAlt,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text variant="strong" style={{ fontSize: 15 }}>
                {p}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>
        </>
      ) : null}
    </Screen>
  );
}
