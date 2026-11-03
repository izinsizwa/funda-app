import { foundationWorlds, lessonForSubject, lessonIdFor, lessons, SUBJECTS, worldLessons } from '@/content/lessons';

describe('lesson content is well formed', () => {
  const all = Object.values(lessons);

  it('keys match lesson ids', () => {
    for (const [key, lesson] of Object.entries(lessons)) expect(lesson.id).toBe(key);
  });
  it.each(all.map((l) => [l.id, l] as const))('%s has valid questions', (_id, lesson) => {
    expect(lesson.questions.length).toBeGreaterThan(0);
    const ids = lesson.questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of lesson.questions) {
      expect(q.choices.length).toBeGreaterThanOrEqual(2);
      expect(new Set(q.choices).size).toBe(q.choices.length); // choices are used as React keys
      expect(Number.isInteger(q.answer)).toBe(true);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.choices.length);
      expect(q.prompt.trim()).not.toBe('');
      expect(q.explanation.trim()).not.toBe('');
    }
  });
  it('every lesson belongs to a known subject', () => {
    const known = new Set(SUBJECTS.map((s) => s.id));
    for (const l of all) expect(known.has(l.subjectId)).toBe(true);
  });
});

describe('navigation into lessons', () => {
  it('every foundation world opens a lesson that exists', () => {
    for (const w of foundationWorlds) expect(lessons[worldLessons[w.id]]).toBeDefined();
  });
  it('every grade has a next lesson', () => {
    for (let g = 0; g <= 9; g++) expect(lessons[lessonIdFor(g)]).toBeDefined();
  });
  it('picks counting for foundation and fractions for older grades', () => {
    expect(lessonIdFor(0)).toBe('counting-1');
    expect(lessonIdFor(3)).toBe('counting-1');
    expect(lessonIdFor(4)).toBe('fractions-1');
  });
  it('finds a lesson for a subject, or nothing', () => {
    expect(lessonForSubject('maths')?.id).toBe('fractions-1');
    expect(lessonForSubject('life-skills')).toBeUndefined();
  });
});
