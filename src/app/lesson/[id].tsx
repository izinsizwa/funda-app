import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { HearIt } from '@/components/ui/HearIt';
import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { Sticker } from '@/components/ui/Sticker';
import { StarRow } from '@/components/ui/StarRow';
import { Text } from '@/components/ui/Text';
import { lessons } from '@/content/lessons';
import { speak, stopSpeaking } from '@/lib/speech';
import { useBand, useLearner, useSession } from '@/state/session';
import { bandConfig } from '@/theme/bands';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * ONE lesson player for every grade. The band config changes how it behaves:
 * Grade R-3 reads the question aloud, shows two big answers per row and skips
 * the explanation; older learners get one answer per row and a short "why".
 */
export default function LessonScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const band = useBand();
  const learner = useLearner();
  const recordResult = useSession((s) => s.recordResult);
  const cfg = bandConfig[band].lesson;
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = id ? lessons[id] : undefined;

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const question = lesson?.questions[index];

  useEffect(() => {
    if (cfg.speakPrompts && question && !done) speak(question.prompt);
    return () => stopSpeaking();
  }, [cfg.speakPrompts, question, done]);

  const close = () => {
    stopSpeaking();
    if (router.canGoBack()) router.back();
    else router.replace('/learner');
  };

  if (!lesson || !question) {
    return (
      <Screen>
        <Text variant="title">We could not find that lesson.</Text>
        <Button label="Back home" onPress={close} />
      </Screen>
    );
  }

  const total = lesson.questions.length;

  if (done) {
    const stars = Math.max(1, Math.round((correct / total) * 3));
    return (
      <Screen>
        <View style={{ alignItems: 'center', gap: 14, marginTop: 24 }}>
          <Mascot size={120} />
          <Text variant="display" align="center">
            {correct === total ? 'Perfect!' : 'Well done!'}
          </Text>
          <Text variant="subheading" align="center" color="muted">
            {`You got ${correct} of ${total} right.`}
          </Text>
          <StarRow total={3} filled={stars} size={44} />
        </View>
        <Button label="Back home" size="lg" fullWidth onPress={() => router.replace('/learner')} />
        <Button
          label="Try again"
          variant="secondary"
          size="lg"
          fullWidth
          onPress={() => {
            setIndex(0);
            setPicked(null);
            setChecked(false);
            setCorrect(0);
            setDone(false);
          }}
        />
      </Screen>
    );
  }

  const isRight = checked && picked === question.answer;
  // Short answers (numbers, letters) sit side by side in one row, so no answer is left alone on a second row.
  const shortAnswers = question.choices.length <= 3 && question.choices.every((c) => c.length <= 4);
  const columns = cfg.choiceColumns === 2 && shortAnswers ? question.choices.length : cfg.choiceColumns;

  const onCheck = () => {
    if (picked === null) return;
    setChecked(true);
    if (picked === question.answer) setCorrect((c) => c + 1);
  };

  const onNext = () => {
    if (index + 1 >= total) {
      if (lesson) {
        recordResult({ learnerId: learner.id, lessonId: lesson.id, subjectId: lesson.subjectId, correct, total });
      }
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    setChecked(false);
  };

  const choiceBg = (i: number) => {
    if (checked) {
      if (i === question.answer) return colors.teal;
      if (i === picked) return colors.coral;
      return colors.surface;
    }
    return i === picked ? colors.sunSoft : colors.surface;
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Close lesson"
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.surface,
            borderWidth: Math.min(theme.borderWidth, 2),
            borderColor: colors.border,
          }}
        >
          <Icon name="close" size={22} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1, gap: 6 }}>
          <Text variant="label" color="muted">{`${lesson.title}, question ${index + 1} of ${total}`}</Text>
          <ProgressBar value={(index + (checked ? 1 : 0)) / total} height={12} label="Lesson progress" />
        </View>
      </View>

      <Card padding={20} innerStyle={{ gap: 12 }}>
        <Text
          variant="title"
          style={{ fontSize: cfg.promptSize, lineHeight: Math.round(cfg.promptSize * 1.25) }}
        >
          {question.prompt}
        </Text>
        {question.visual ? (
          <Text
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={{ fontFamily: theme.fonts.heading, fontSize: 48, lineHeight: 56, letterSpacing: 6 }}
          >
            {question.visual}
          </Text>
        ) : null}
        {cfg.speakPrompts ? <HearIt text={question.prompt} label="Hear it again" /> : null}
      </Card>

      <Grid columns={columns} gap={12}>
        {question.choices.map((choice, i) => (
          <Sticker
            key={choice}
            bg={choiceBg(i)}
            radius={theme.radius.card}
            shadow={theme.shadow > 0 ? 4 : 0}
            onPress={checked ? undefined : () => setPicked(i)}
            accessibilityLabel={choice}
            accessibilityState={{ selected: i === picked }}
            innerStyle={{ minHeight: Math.max(64, theme.minTap + 8), justifyContent: 'center', paddingHorizontal: 18 }}
          >
            <Text variant="heading" align={columns > 1 ? 'center' : 'left'} style={{ fontSize: columns > 1 ? 30 : 20 }} color={checked && (i === question.answer || i === picked) ? 'ink' : 'text'}>
              {choice}
            </Text>
          </Sticker>
        ))}
      </Grid>

      {checked ? (
        <Card tone={isRight ? 'tealSoft' : 'coralSoft'} padding={14} shadow={0} innerStyle={{ gap: 4 }}>
          <Text variant="heading" style={{ fontSize: 20 }} color="ink" accessibilityLiveRegion="polite">
            {isRight ? 'Yes, well done!' : 'Not quite, good try!'}
          </Text>
          {cfg.showExplanation ? <Text color="ink">{question.explanation}</Text> : null}
        </Card>
      ) : null}

      <Button
        label={checked ? (index + 1 >= total ? 'Finish' : 'Next') : 'Check'}
        size="lg"
        fullWidth
        variant={checked ? 'accent' : 'primary'}
        disabled={!checked && picked === null}
        onPress={checked ? onNext : onCheck}
      />
    </Screen>
  );
}
