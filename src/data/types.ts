export type Role = 'parent' | 'learner';

/** Colour keys an avatar can use. */
export type AvatarTone = 'sun' | 'teal' | 'coral' | 'lavenderStrong';

export type Profile = {
  id: string;
  role: Role;
  name: string;
  /** Learners only. 0 = Grade R. */
  grade?: number;
  tone: AvatarTone;
};

export type Household = {
  parent: Profile;
  email: string;
  learners: Profile[];
  planName: string;
  learnerSlots: number;
};

export type Subject = {
  id: string;
  name: string;
};

export type World = {
  id: string;
  label: string;
  /** Big text shown on the tile, e.g. "1 2 3". Omit to show an icon instead. */
  glyph?: string;
  icon?: 'chat' | 'storybook';
  tone: 'sun' | 'teal' | 'coral' | 'lavenderStrong';
};

export type Question = {
  id: string;
  prompt: string;
  /** Big picture-like line shown under the prompt, e.g. stars or a letter. Not read aloud. */
  visual?: string;
  choices: string[];
  answer: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  subjectId: string;
  title: string;
  subject: string;
  questions: Question[];
};

/** One finished lesson attempt. Everything about progress is derived from these. */
export type LessonResult = {
  learnerId: string;
  lessonId: string;
  subjectId: string;
  correct: number;
  total: number;
  /** Milliseconds since the epoch. */
  at: number;
};

export type BadgeId = 'first-lesson' | 'perfect-quiz' | 'streak-3' | 'streak-7' | 'story-time';

export type Badge = {
  id: BadgeId;
  label: string;
  icon: 'flame' | 'star' | 'sun' | 'storybook';
  tone: 'sun' | 'teal' | 'coral' | 'lavenderStrong';
};
