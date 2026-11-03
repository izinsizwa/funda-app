import type { LessonResult } from '@/data/types';
import {
  earnedBadges,
  focusAreas,
  levelFor,
  masteryLabel,
  missionsToday,
  starsForResult,
  starsToday,
  streakDays,
  subjectProgress,
  totalStars,
  weeklyReport,
} from '@/domain/progress';

const at = (y: number, m: number, d: number, h = 10) => new Date(y, m - 1, d, h).getTime();
const NOW = at(2026, 10, 29, 15);

const result = (over: Partial<LessonResult> = {}): LessonResult => ({
  learnerId: 'learner-1',
  lessonId: 'fractions-1',
  subjectId: 'maths',
  correct: 2,
  total: 3,
  at: NOW,
  ...over,
});

describe('with no results nothing is invented', () => {
  it('gives zeros and empty lists', () => {
    expect(totalStars([])).toBe(0);
    expect(starsToday([], NOW)).toBe(0);
    expect(streakDays([], NOW)).toBe(0);
    expect(levelFor([])).toBe(1);
    expect(earnedBadges([], NOW)).toEqual([]);
    expect(focusAreas(subjectProgress([]))).toEqual([]);
  });

  it('marks every subject as not started', () => {
    const subjects = subjectProgress([]);
    expect(subjects.length).toBeGreaterThan(0);
    expect(subjects.every((s) => s.mastery === null)).toBe(true);
    expect(masteryLabel(null)).toBe('Not started');
  });

  it('reports no activity this week', () => {
    const r = weeklyReport('Thandi', [], NOW);
    expect(r).toMatchObject({ daysActive: 0, lessonsFinished: 0, accuracy: null, win: null, focus: null });
    expect(r.headline).toContain('Thandi');
  });
});

describe('stars', () => {
  it('gives 1 to 3 stars by score', () => {
    expect(starsForResult({ correct: 0, total: 3 })).toBe(1);
    expect(starsForResult({ correct: 2, total: 3 })).toBe(2);
    expect(starsForResult({ correct: 3, total: 3 })).toBe(3);
  });
  it('gives no stars for an empty lesson', () => {
    expect(starsForResult({ correct: 0, total: 0 })).toBe(0);
  });
  it('adds up total stars and only counts today for starsToday', () => {
    const rs = [result({ correct: 3 }), result({ correct: 3, at: at(2026, 10, 28) })];
    expect(totalStars(rs)).toBe(6);
    expect(starsToday(rs, NOW)).toBe(3);
  });
});

describe('streakDays', () => {
  it('counts consecutive days ending today', () => {
    const rs = [at(2026, 10, 29), at(2026, 10, 28), at(2026, 10, 27)].map((t) => result({ at: t }));
    expect(streakDays(rs, NOW)).toBe(3);
  });
  it('keeps the streak alive if the last lesson was yesterday', () => {
    const rs = [at(2026, 10, 28), at(2026, 10, 27)].map((t) => result({ at: t }));
    expect(streakDays(rs, NOW)).toBe(2);
  });
  it('resets after a missed day', () => {
    expect(streakDays([result({ at: at(2026, 10, 27) })], NOW)).toBe(0);
  });
  it('stops at a gap', () => {
    const rs = [at(2026, 10, 29), at(2026, 10, 27)].map((t) => result({ at: t }));
    expect(streakDays(rs, NOW)).toBe(1);
  });
  it('counts several lessons on one day once', () => {
    expect(streakDays([result(), result(), result()], NOW)).toBe(1);
  });
  it('is not broken by a month boundary', () => {
    const now = at(2026, 11, 1, 9);
    const rs = [at(2026, 11, 1), at(2026, 10, 31), at(2026, 10, 30)].map((t) => result({ at: t }));
    expect(streakDays(rs, now)).toBe(3);
  });
});

describe('levelFor', () => {
  it('goes up every 15 correct answers', () => {
    expect(levelFor([result({ correct: 14, total: 20 })])).toBe(1);
    expect(levelFor([result({ correct: 15, total: 20 })])).toBe(2);
    expect(levelFor([result({ correct: 10 }), result({ correct: 10 }), result({ correct: 10 })])).toBe(3);
  });
});

describe('subjectProgress and focusAreas', () => {
  const rs = [
    result({ subjectId: 'maths', correct: 1, total: 4 }),
    result({ subjectId: 'maths', correct: 2, total: 4 }),
    result({ subjectId: 'english', correct: 3, total: 3 }),
    result({ subjectId: 'isizulu', correct: 2, total: 4 }),
  ];
  const progress = subjectProgress(rs);
  const mastery = (id: string) => progress.find((p) => p.id === id)?.mastery;

  it('works out the share right per subject', () => {
    expect(mastery('maths')).toBe(38);
    expect(mastery('english')).toBe(100);
    expect(mastery('isizulu')).toBe(50);
    expect(mastery('life-skills')).toBeNull();
  });
  it('lists the weakest subjects first and skips subjects not started', () => {
    expect(focusAreas(progress).map((f) => f.id)).toEqual(['maths', 'isizulu']);
  });
  it('respects the limit', () => {
    expect(focusAreas(progress, 1)).toHaveLength(1);
  });
});

describe('masteryLabel', () => {
  it.each([
    [90, 'Strong'],
    [85, 'Strong'],
    [75, 'Getting strong'],
    [60, 'Keep going'],
    [59, "Let's practise this"],
    [0, "Let's practise this"],
  ])('%i is %s', (value, label) => {
    expect(masteryLabel(value)).toBe(label);
  });
});

describe('missionsToday', () => {
  it('starts with nothing done', () => {
    const m = missionsToday([], NOW);
    expect(m.every((x) => !x.done)).toBe(true);
  });
  it('marks the lesson mission done after one lesson and counts answers', () => {
    const m = missionsToday([result({ total: 3 })], NOW);
    expect(m.find((x) => x.id === 'lesson')?.done).toBe(true);
    expect(m.find((x) => x.id === 'answers')).toMatchObject({ done: false, progress: '3 of 5' });
  });
  it('completes the answers mission at 5', () => {
    const m = missionsToday([result({ total: 3 }), result({ total: 3 })], NOW);
    expect(m.find((x) => x.id === 'answers')?.done).toBe(true);
  });
  it('ignores yesterday', () => {
    const m = missionsToday([result({ at: at(2026, 10, 28) })], NOW);
    expect(m.every((x) => !x.done)).toBe(true);
  });
});

describe('earnedBadges', () => {
  const ids = (rs: LessonResult[]) => earnedBadges(rs, NOW).map((b) => b.id);

  it('gives first lesson after any lesson', () => {
    expect(ids([result()])).toEqual(['first-lesson']);
  });
  it('gives perfect quiz only for a full score', () => {
    expect(ids([result({ correct: 3 })])).toContain('perfect-quiz');
    expect(ids([result({ correct: 2 })])).not.toContain('perfect-quiz');
  });
  it('gives streak badges at 3 and 7 days', () => {
    const days = (n: number) => Array.from({ length: n }, (_, i) => result({ at: at(2026, 10, 29 - i) }));
    expect(ids(days(2))).not.toContain('streak-3');
    expect(ids(days(3))).toContain('streak-3');
    expect(ids(days(3))).not.toContain('streak-7');
    expect(ids(days(7))).toEqual(expect.arrayContaining(['streak-3', 'streak-7']));
  });
  it('gives story time after the stories lesson', () => {
    expect(ids([result({ lessonId: 'stories-1' })])).toContain('story-time');
  });
});

describe('weeklyReport', () => {
  it('summarises the last 7 days only', () => {
    const rs = [
      result({ correct: 3, total: 3, at: at(2026, 10, 29) }),
      result({ correct: 1, total: 3, at: at(2026, 10, 27), subjectId: 'isizulu', lessonId: 'isizulu-1' }),
      result({ correct: 0, total: 3, at: at(2026, 10, 10) }),
    ];
    const r = weeklyReport('Thandi', rs, NOW);
    expect(r.daysActive).toBe(2);
    expect(r.lessonsFinished).toBe(2);
    expect(r.accuracy).toBe(67);
    expect(r.win).toContain('Maths');
    expect(r.focus).toContain('isiZulu');
  });
  it('has no focus when everything is going well', () => {
    const r = weeklyReport('Thandi', [result({ correct: 3, total: 3 })], NOW);
    expect(r.focus).toBeNull();
    expect(r.win).not.toBeNull();
  });
  it('ignores future-dated results', () => {
    const r = weeklyReport('Thandi', [result({ at: at(2026, 11, 5) })], NOW);
    expect(r.lessonsFinished).toBe(0);
  });
});
