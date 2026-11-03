/**
 * Learning CONTENT, not user data. These starter lessons are placeholders for
 * the tutor's own material; they are what a learner studies, never numbers
 * about a learner. Replace this file with a fetch from the backend later.
 */
import type { Lesson, Subject, World } from '@/data/types';

/** The CAPS subjects shown to Grade 4-9 learners. */
export const SUBJECTS: Subject[] = [
  { id: 'maths', name: 'Maths' },
  { id: 'english', name: 'English' },
  { id: 'isizulu', name: 'isiZulu' },
  { id: 'natural-sciences', name: 'Natural Sciences' },
  { id: 'social-sciences', name: 'Social Sciences' },
  { id: 'life-skills', name: 'Life Skills' },
];

export const foundationWorlds: World[] = [
  { id: 'numbers', label: 'Numbers', glyph: '1 2 3', tone: 'sun' },
  { id: 'letters', label: 'Letters', glyph: 'A b c', tone: 'teal' },
  { id: 'isizulu', label: 'isiZulu', icon: 'chat', tone: 'coral' },
  { id: 'stories', label: 'Stories', icon: 'storybook', tone: 'lavenderStrong' },
];

export const lessons: Record<string, Lesson> = {
  'counting-1': {
    id: 'counting-1',
    subjectId: 'maths',
    title: 'Counting stars',
    subject: 'Numbers',
    questions: [
      { id: 'q1', prompt: 'How many stars?', visual: '★ ★ ★', choices: ['2', '3', '4'], answer: 1, explanation: 'There are three stars.' },
      { id: 'q2', prompt: 'Which number comes after 4?', choices: ['3', '5', '6'], answer: 1, explanation: 'After 4 comes 5.' },
      { id: 'q3', prompt: 'Which is the biggest number?', choices: ['7', '2', '5'], answer: 0, explanation: 'Seven is the biggest.' },
    ],
  },
  'letters-1': {
    id: 'letters-1',
    subjectId: 'english',
    title: 'Letter friends',
    subject: 'Letters',
    questions: [
      { id: 'q1', prompt: 'Which letter is this?', visual: 'B', choices: ['A', 'B', 'C'], answer: 1, explanation: 'This is the letter B.' },
      { id: 'q2', prompt: 'Which word starts with the letter S?', choices: ['Sun', 'Moon', 'Tree'], answer: 0, explanation: 'Sun starts with S.' },
      { id: 'q3', prompt: 'Which is the small letter for A?', choices: ['a', 'b', 'd'], answer: 0, explanation: 'The small letter for A is a.' },
    ],
  },
  'isizulu-1': {
    id: 'isizulu-1',
    subjectId: 'isizulu',
    title: 'Say hello in isiZulu',
    subject: 'isiZulu',
    questions: [
      { id: 'q1', prompt: 'What does "Sawubona" mean?', choices: ['Hello', 'Goodbye', 'Thank you'], answer: 0, explanation: 'Sawubona means hello.' },
      { id: 'q2', prompt: 'What does "Ngiyabonga" mean?', choices: ['Hello', 'Thank you', 'Please'], answer: 1, explanation: 'Ngiyabonga means thank you.' },
      { id: 'q3', prompt: 'What does "Hamba kahle" mean?', choices: ['Good morning', 'Go well', 'I am hungry'], answer: 1, explanation: 'Hamba kahle means go well, a kind way to say goodbye.' },
    ],
  },
  'stories-1': {
    id: 'stories-1',
    subjectId: 'english',
    title: 'Funi finds a book',
    subject: 'Stories',
    questions: [
      { id: 'q1', prompt: 'Funi found a red book. What colour was the book?', choices: ['Red', 'Blue', 'Green'], answer: 0, explanation: 'The book was red.' },
      { id: 'q2', prompt: 'Funi opened the book and saw a lion. What did Funi see?', choices: ['A cat', 'A lion', 'A bird'], answer: 1, explanation: 'Funi saw a lion.' },
      { id: 'q3', prompt: 'The lion said hello. What did the lion say?', choices: ['Goodbye', 'Hello', 'Thank you'], answer: 1, explanation: 'The lion said hello.' },
    ],
  },
  'fractions-1': {
    id: 'fractions-1',
    subjectId: 'maths',
    title: 'Fractions and decimals',
    subject: 'Maths',
    questions: [
      {
        id: 'q1',
        prompt: 'Which fraction is equal to 1/2?',
        choices: ['2/4', '1/3', '2/3', '3/5'],
        answer: 0,
        explanation: '2/4 simplifies to 1/2, because you can divide the top and bottom by 2.',
      },
      {
        id: 'q2',
        prompt: 'What is 0.5 as a fraction?',
        choices: ['1/5', '1/2', '5/100', '2/5'],
        answer: 1,
        explanation: '0.5 means five tenths, which is 5/10, and that simplifies to 1/2.',
      },
      {
        id: 'q3',
        prompt: 'Which is the biggest: 3/4, 2/3 or 5/8?',
        choices: ['3/4', '2/3', '5/8', 'They are equal'],
        answer: 0,
        explanation: 'As decimals: 3/4 = 0.75, 2/3 is about 0.67 and 5/8 = 0.625.',
      },
    ],
  },
};


/** The lesson a learner continues with. */
export function lessonIdFor(grade: number): string {
  return grade <= 3 ? 'counting-1' : 'fractions-1';
}

/** Each Foundation "world" opens its own small lesson. */
export const worldLessons: Record<string, string> = {
  numbers: 'counting-1',
  letters: 'letters-1',
  isizulu: 'isizulu-1',
  stories: 'stories-1',
};

/** The first lesson for a subject, if there is one yet. */
export function lessonForSubject(subjectId: string): Lesson | undefined {
  return Object.values(lessons).find((l) => l.subjectId === subjectId && l.id !== 'counting-1');
}
