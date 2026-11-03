import React from 'react';

import { FoundationHome } from '@/components/home/FoundationHome';
import { IntermediateHome } from '@/components/home/IntermediateHome';
import { SeniorHome } from '@/components/home/SeniorHome';
import { useBand } from '@/state/session';

/**
 * Home is the one learner screen with three genuinely different layouts.
 * Everything else (lessons, tutor, progress) is shared and adapts through
 * the theme and the band config.
 */
export default function LearnerHome() {
  const band = useBand();
  if (band === 'foundation') return <FoundationHome />;
  if (band === 'intermediate') return <IntermediateHome />;
  return <SeniorHome />;
}
