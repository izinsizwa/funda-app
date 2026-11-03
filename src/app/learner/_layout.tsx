import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import React from 'react';

import { TabBar, TabButton } from '@/components/ui/TabBar';
import { features } from '@/config/features';
import { useBand } from '@/state/session';
import { bandConfig } from '@/theme/bands';

/**
 * Learner tabs. The tab bar is the clearest example of "one app, three
 * experiences": Grade R-3 gets three big tabs, everyone else gets a fourth
 * tab for the AI tutor. Same routes, same code, different config.
 */
export default function LearnerLayout() {
  const band = useBand();
  const config = bandConfig[band];
  const showAsk = config.showAskTab && features.tutorChat;

  return (
    <Tabs>
      <TabSlot />

      <TabBar>
        <TabTrigger name="home" asChild>
          <TabButton label="Home" icon="home" />
        </TabTrigger>
        <TabTrigger name="learn" asChild>
          <TabButton label="Learn" icon="book" />
        </TabTrigger>
        {showAsk ? (
          <TabTrigger name="ask" asChild>
            <TabButton label={config.askTabLabel} icon={band === 'senior' ? 'sparkle' : 'chat'} />
          </TabTrigger>
        ) : null}
        <TabTrigger name="me" asChild>
          <TabButton label="Me" icon="user" />
        </TabTrigger>
      </TabBar>

      {/* Defines which routes exist; hidden from view. */}
      <TabList style={{ display: 'none' }}>
        <TabTrigger name="home" href="/learner" />
        <TabTrigger name="learn" href="/learner/learn" />
        {showAsk ? <TabTrigger name="ask" href="/learner/ask" /> : null}
        <TabTrigger name="me" href="/learner/me" />
      </TabList>
    </Tabs>
  );
}
