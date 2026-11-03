import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import React from 'react';

import { TabBar, TabButton } from '@/components/ui/TabBar';
import { features } from '@/config/features';

/** Parent tabs. Only reachable once the parent PIN has been entered. */
export default function ParentLayout() {
  return (
    <Tabs>
      <TabSlot />

      <TabBar>
        <TabTrigger name="home" asChild>
          <TabButton label="Home" icon="home" />
        </TabTrigger>
        <TabTrigger name="reports" asChild>
          <TabButton label="Reports" icon="bars" />
        </TabTrigger>
        {features.tutorChat ? (
          <TabTrigger name="messages" asChild>
            <TabButton label="Messages" icon="chat" />
          </TabTrigger>
        ) : null}
        <TabTrigger name="settings" asChild>
          <TabButton label="Settings" icon="gear" />
        </TabTrigger>
      </TabBar>

      <TabList style={{ display: 'none' }}>
        <TabTrigger name="home" href="/parent" />
        <TabTrigger name="reports" href="/parent/reports" />
        {features.tutorChat ? <TabTrigger name="messages" href="/parent/messages" /> : null}
        <TabTrigger name="settings" href="/parent/settings" />
      </TabList>
    </Tabs>
  );
}
