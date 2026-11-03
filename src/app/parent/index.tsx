import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';

import { ReportCard } from '@/components/parent/ReportCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { features, WEB_ACCOUNT_URL } from '@/config/features';
import { useSession } from '@/state/session';
import { useTheme } from '@/theme/ThemeProvider';
import { Toggle } from '@/components/ui/Toggle';

const QUIET_OPTIONS = ['19:00', '20:00', '21:00'] as const;

/** Parent home: how each child is doing, report settings, and the plan. */
export default function ParentHome() {
  const router = useRouter();
  const theme = useTheme();
  const { colors } = theme;
  const household = useSession((s) => s.household);
  const leaveProfile = useSession((s) => s.leaveProfile);
  const learners = household?.learners ?? [];

  const [selectedId, setSelectedId] = useState(learners[0]?.id);
  const [whatsapp, setWhatsapp] = useState(false);
  const [language, setLanguage] = useState<'English' | 'isiZulu'>('English');
  const [quiet, setQuiet] = useState<(typeof QUIET_OPTIONS)[number]>('20:00');

  const selected = learners.find((l) => l.id === selectedId) ?? learners[0];
  if (!household) return null;

  const openWebsite = () => {
    if (!WEB_ACCOUNT_URL) return;
    Linking.openURL(WEB_ACCOUNT_URL).catch(() => {
      // No browser available; nothing else to do.
    });
  };
  const canAdd = learners.length < household.learnerSlots;

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Mascot size={44} />
          <Text variant="heading" style={{ fontSize: 20 }}>
            Funda KZN Hub
          </Text>
        </View>
        <Pressable
          onPress={leaveProfile}
          accessibilityRole="button"
          accessibilityLabel="Leave the parent area"
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.surface,
            borderWidth: theme.borderWidth,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="user" size={22} color={colors.text} strokeWidth={2} />
        </Pressable>
      </View>

      {selected ? (
        <>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {learners.map((l) => (
              <Chip key={l.id} label={l.name} selected={l.id === selected.id} onPress={() => setSelectedId(l.id)} />
            ))}
          </View>

          <ReportCard learner={selected}>
            <Button
              label="See all reports"
              variant="secondary"
              size="md"
              fullWidth
              onPress={() => router.push('/parent/reports')}
            />
            {features.tutorChat ? (
              <Button
                label="Message the tutor"
                variant="primary"
                size="md"
                fullWidth
                onPress={() => router.push('/parent/messages')}
              />
            ) : null}
          </ReportCard>
        </>
      ) : (
        <Card padding={20} innerStyle={{ gap: 12 }}>
          <Text variant="heading" style={{ fontSize: 20 }}>
            Add your first learner
          </Text>
          <Text color="muted">Learners pick their own picture to start, and their progress shows up here.</Text>
        </Card>
      )}

      {canAdd ? (
        <Button label="Add a learner" variant={selected ? 'secondary' : 'primary'} size="md" fullWidth icon="plus" onPress={() => router.push('/add-learner')} />
      ) : null}

      {features.whatsappReports ? (
      <Card padding={20} innerStyle={{ gap: 14 }}>
        <Text variant="heading" style={{ fontSize: 20 }}>
          Weekly report
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 }}>
          <View style={{ flex: 1 }}>
            <Text variant="strong">Send to WhatsApp</Text>
            <Text variant="label" color="muted">
              Every Sunday evening
            </Text>
          </View>
          <Toggle value={whatsapp} onValueChange={setWhatsapp} label="Send the weekly report to WhatsApp" />
        </View>

        <View style={{ gap: 8 }}>
          <Text variant="strong">Language</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip label="English" selected={language === 'English'} selectedTone="text" onPress={() => setLanguage('English')} />
            <Chip label="isiZulu" selected={language === 'isiZulu'} selectedTone="text" onPress={() => setLanguage('isiZulu')} />
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <View>
            <Text variant="strong">Quiet hours</Text>
            <Text variant="label" color="muted">{`No messages after ${quiet}`}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {QUIET_OPTIONS.map((q) => (
              <Chip key={q} label={q} selected={quiet === q} selectedTone="text" onPress={() => setQuiet(q)} />
            ))}
          </View>
        </View>
      </Card>
      ) : null}

      <Card padding={20} innerStyle={{ gap: 10 }}>
        <View style={{ gap: 2 }}>
          <Text variant="heading" style={{ fontSize: 20 }}>
            {household.planName}
          </Text>
          <Text color="muted">{`${learners.length} of ${household.learnerSlots} learners added`}</Text>
        </View>
        {WEB_ACCOUNT_URL ? (
        <Button
          label="Manage plan on our website"
          variant="primary"
          size="md"
          fullWidth
          icon="external"
          iconPosition="right"
          onPress={openWebsite}
        />
        ) : null}
        <Text variant="label" color="muted">
          Payments and receipts are handled securely on the website.
        </Text>
      </Card>
    </Screen>
  );
}
