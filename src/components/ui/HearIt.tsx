import React from 'react';

import { speak } from '@/lib/speech';
import { Button } from './Button';

/** "Hear it" button: reads the given text aloud. */
export function HearIt({ text, label = 'Hear it' }: { text: string; label?: string }) {
  return <Button label={label} variant="secondary" size="sm" pill icon="speaker" onPress={() => speak(text)} />;
}
