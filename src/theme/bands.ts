/**
 * Age bands: the single idea that lets ONE app look and behave differently
 * for a Grade R learner, a Grade 8 learner and a parent.
 *
 * Grade 0 means Grade R.
 */
export type Band = 'foundation' | 'intermediate' | 'senior';

/** A theme is one of the three learner bands, or the calmer parent look. */
export type ThemeKind = Band | 'parent';

export function bandForGrade(grade: number): Band {
  if (grade <= 3) return 'foundation';
  if (grade <= 6) return 'intermediate';
  return 'senior';
}

export function gradeLabel(grade: number): string {
  return grade === 0 ? 'Grade R' : `Grade ${grade}`;
}

/**
 * Behaviour that changes by band but is not just colours and sizes.
 * Screens read this instead of checking the band name everywhere.
 */
export type BandConfig = {
  label: string;
  /** Foundation learners get 3 tabs; older learners also get the tutor tab. */
  showAskTab: boolean;
  askTabLabel: string;
  lesson: {
    /** Read the question aloud automatically (pre-readers). */
    speakPrompts: boolean;
    choiceColumns: 1 | 2;
    promptSize: number;
    /** Show a short "why" after each answer. */
    showExplanation: boolean;
  };
};

export const bandConfig: Record<Band, BandConfig> = {
  foundation: {
    label: 'Grade R-3',
    showAskTab: false,
    askTabLabel: 'Ask',
    lesson: { speakPrompts: true, choiceColumns: 2, promptSize: 30, showExplanation: false },
  },
  intermediate: {
    label: 'Grade 4-6',
    showAskTab: true,
    askTabLabel: 'Ask Funi',
    lesson: { speakPrompts: false, choiceColumns: 1, promptSize: 24, showExplanation: true },
  },
  senior: {
    label: 'Grade 7-9',
    showAskTab: true,
    askTabLabel: 'Tutor',
    lesson: { speakPrompts: false, choiceColumns: 1, promptSize: 22, showExplanation: true },
  },
};
