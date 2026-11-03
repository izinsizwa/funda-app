import React from 'react';
import { View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import type { Profile } from '@/data/types';
import { useProgress } from '@/state/session';
import { gradeLabel } from '@/theme/bands';
import { useTheme } from '@/theme/ThemeProvider';

function Stat({ value, label, bg }: { value: string; label: string; bg: string }) {
  return (
    <View style={{ flex: 1, gap: 2, padding: 12, borderRadius: 14, backgroundColor: bg }}>
      <Text variant="title" color="ink" style={{ fontSize: 26, lineHeight: 30 }}>
        {value}
      </Text>
      <Text variant="label" color="muted">
        {label}
      </Text>
    </View>
  );
}

function Point({ kind, label, text }: { kind: 'win' | 'focus'; label: string; text: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: kind === 'win' ? colors.teal : colors.coral,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={kind === 'win' ? 'check' : 'alert'} size={16} color={colors.ink} strokeWidth={3} />
      </View>
      <Text style={{ flex: 1 }}>
        <Text variant="strong">{`${label} `}</Text>
        {text}
      </Text>
    </View>
  );
}

/**
 * The weekly report a parent sees (and gets on WhatsApp): wins first,
 * one thing to work on, plain language, no jargon.
 */
export function ReportCard({ learner, children }: { learner: Profile; children?: React.ReactNode }) {
  const { colors } = useTheme();
  const { report } = useProgress(learner);

  return (
    <Card padding={20} innerStyle={{ gap: 16 }}>
      <View style={{ gap: 4 }}>
        <Text variant="title" style={{ fontSize: 26 }}>
          {report.headline}
        </Text>
        <Text color="muted">{`${gradeLabel(learner.grade ?? 4)}, last 7 days`}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat value={String(report.daysActive)} label="days active" bg={colors.sunSoft} />
        <Stat value={String(report.lessonsFinished)} label="lessons finished" bg={colors.tealSoft} />
        <Stat value={report.accuracy === null ? '-' : `${report.accuracy}%`} label="answers right" bg={colors.lavender} />
      </View>

      <View style={{ gap: 10 }}>
        {report.win ? <Point kind="win" label="Win:" text={report.win} /> : null}
        {report.focus ? <Point kind="focus" label="To work on:" text={report.focus} /> : null}
        {!report.win && !report.focus ? (
          <Text color="muted">{`Once ${learner.name} finishes a lesson, wins and things to work on will show here.`}</Text>
        ) : null}
      </View>

      {children}
    </Card>
  );
}
