import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { Pill } from '@/components/ui/Pill';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { features } from '@/config/features';
import { lessonIdFor, lessons } from '@/content/lessons';
import { masteryLabel } from '@/domain/progress';
import { useLearner, useProgress } from '@/state/session';
import { useTheme } from '@/theme/ThemeProvider';
import { BadgeItem, SectionTitle, SwitchLearner } from './LearnerBits';

/** Grade 4-6: missions and streaks, friendly words instead of raw scores, Funi the helper. */
export function IntermediateHome() {
  const router = useRouter();
  const theme = useTheme();
  const learner = useLearner();
  const progress = useProgress(learner);
  const subjects = progress.subjects;
  const nextLesson = lessons[lessonIdFor(learner.grade ?? 4)];

  const openAsk = (prompt: string) => router.push({ pathname: '/learner/ask', params: { prompt } });

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text color="muted" style={{ fontFamily: theme.fonts.strong }}>
            Sawubona,
          </Text>
          <Text variant="display">{`${learner.name}!`}</Text>
        </View>
        <SwitchLearner learner={learner} />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Pill label={`${progress.streak} ${progress.streak === 1 ? 'day' : 'days'}`} icon="flame" iconFill="coral" kind="stat" />
        <Pill label={`Level ${progress.level}`} kind="stat" />
      </View>

      <Card tone="primary" padding={20} innerStyle={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill label="Next lesson" tone="sun" />
          <Mascot size={64} />
        </View>
        <Text variant="title" color="onPrimary">
          {nextLesson.title}
        </Text>
        <Text variant="strong" color="onPrimary">
          {nextLesson.subject}
        </Text>
        <Button
          label="Start"
          variant="accent"
          size="lg"
          fullWidth
          icon="play"
          onPress={() => router.push(`/lesson/${lessonIdFor(learner.grade ?? 4)}`)}
        />
      </Card>

      <SectionTitle>Today's missions</SectionTitle>
      <Card padding={0} innerStyle={{ paddingHorizontal: 16 }}>
        {progress.missions.map((m, i) => (
          <View
            key={m.id}
            accessible
            accessibilityLabel={`${m.label}, ${m.progress}`}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              minHeight: 56,
              borderTopWidth: i === 0 ? 0 : 2,
              borderTopColor: theme.colors.track,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: m.done ? theme.colors.teal : theme.colors.surface,
                borderWidth: 3,
                borderColor: theme.colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {m.done ? <Icon name="check" size={18} color={theme.colors.ink} strokeWidth={3} /> : null}
            </View>
            <Text variant="strong" style={{ flex: 1, fontSize: 17 }}>
              {m.label}
            </Text>
            <Text variant="label" color="muted">
              {m.progress}
            </Text>
          </View>
        ))}
      </Card>

      <SectionTitle>Your subjects</SectionTitle>
      <Grid columns={2} gap={12}>
        {subjects.map((s) => {
          const needsLove = s.mastery !== null && s.mastery < 60;
          return (
            <Card
              key={s.id}
              tone={needsLove ? 'coralSoft' : 'surface'}
              padding={14}
              radius={22}
              shadow={0}
              onPress={() => router.push('/learner/learn')}
              accessibilityLabel={`${s.name}, ${masteryLabel(s.mastery)}`}
              innerStyle={{ minHeight: 104, gap: 8 }}
            >
              <Text variant="heading" style={{ fontSize: 19, lineHeight: 22 }}>
                {s.name}
              </Text>
              <ProgressBar
                value={(s.mastery ?? 0) / 100}
                color={needsLove ? 'coral' : 'primary'}
                trackColor={needsLove ? theme.colors.white : theme.colors.track}
                label={`${s.name} progress`}
              />
              <Text variant="label" color={needsLove ? 'text' : 'muted'}>
                {masteryLabel(s.mastery)}
              </Text>
            </Card>
          );
        })}
      </Grid>

      {features.tutorChat ? (
      <Card tone="lavender" padding={16} innerStyle={{ gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <Mascot size={64} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text variant="heading" style={{ fontSize: 22 }}>
              Ask Funi
            </Text>
            <Text variant="strong" style={{ fontFamily: theme.fonts.body }}>
              Stuck on something? Ask me, in English or isiZulu.
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Button
            label="Explain simply"
            size="sm"
            pill
            onPress={() => openAsk('Explain this simply')}
          />
          <Button
            label="Test me"
            size="sm"
            pill
            variant="secondary"
            onPress={() => openAsk('Test me')}
          />
        </View>
      </Card>

      ) : null}

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
    </Screen>
  );
}
