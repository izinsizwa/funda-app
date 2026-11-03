/**
 * Everything a learner or parent sees about progress is calculated here from
 * real lesson results. Nothing is invented: no results means zero, "not
 * started", or an empty list.
 *
 * Days are the device's local calendar days.
 */
import { SUBJECTS } from '@/content/lessons';
import type { Badge, BadgeId, LessonResult, Subject } from '@/data/types';

export const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (ms: number) => {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};

/** Whole local days between two moments (0 = same day). */
const daysBetween = (laterMs: number, earlierMs: number) =>
  Math.round((startOfDay(laterMs) - startOfDay(earlierMs)) / DAY_MS);

/** 1 to 3 stars for one attempt, matching the lesson result screen. */
export function starsForResult(r: Pick<LessonResult, 'correct' | 'total'>): number {
  if (r.total <= 0) return 0;
  return Math.max(1, Math.round((r.correct / r.total) * 3));
}

export function totalStars(results: LessonResult[]): number {
  return results.reduce((sum, r) => sum + starsForResult(r), 0);
}

export function starsToday(results: LessonResult[], now: number): number {
  return results.filter((r) => daysBetween(now, r.at) === 0).reduce((sum, r) => sum + starsForResult(r), 0);
}

/**
 * Days in a row with at least one finished lesson. A streak is still alive
 * if the last lesson was yesterday, so it does not drop before the day ends.
 */
export function streakDays(results: LessonResult[], now: number): number {
  const days = new Set(results.map((r) => startOfDay(r.at)));
  let cursor = startOfDay(now);
  if (!days.has(cursor)) cursor -= DAY_MS;
  // Step by calendar day, not by 24 hours, so daylight-saving changes cannot break a streak.
  let count = 0;
  while (days.has(startOfDay(cursor))) {
    count += 1;
    const d = new Date(cursor);
    cursor = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1).getTime();
  }
  return count;
}

/** Level goes up by one for every 15 correct answers. Everyone starts at 1. */
export function levelFor(results: LessonResult[]): number {
  const correct = results.reduce((sum, r) => sum + r.correct, 0);
  return 1 + Math.floor(correct / 15);
}

export type SubjectProgress = Subject & {
  /** 0 to 100, or null when the learner has not answered anything in it yet. */
  mastery: number | null;
};

/** Share of answers right in each subject. */
export function subjectProgress(results: LessonResult[], subjects: Subject[] = SUBJECTS): SubjectProgress[] {
  return subjects.map((s) => {
    const mine = results.filter((r) => r.subjectId === s.id);
    const total = mine.reduce((sum, r) => sum + r.total, 0);
    const correct = mine.reduce((sum, r) => sum + r.correct, 0);
    return { ...s, mastery: total === 0 ? null : Math.round((correct / total) * 100) };
  });
}

export function masteryLabel(mastery: number | null): string {
  if (mastery === null) return 'Not started';
  if (mastery >= 85) return 'Strong';
  if (mastery >= 70) return 'Getting strong';
  if (mastery >= 60) return 'Keep going';
  return "Let's practise this";
}

/** The subjects that need the most work, weakest first. Only subjects with answers count. */
export function focusAreas(progress: SubjectProgress[], limit = 3): (SubjectProgress & { mastery: number })[] {
  return progress
    .filter((p): p is SubjectProgress & { mastery: number } => p.mastery !== null && p.mastery < 70)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, limit);
}

export type Mission = { id: string; label: string; progress: string; done: boolean };

/** Today's missions, worked out from what the learner has done today. */
export function missionsToday(results: LessonResult[], now: number): Mission[] {
  const today = results.filter((r) => daysBetween(now, r.at) === 0);
  const answered = today.reduce((sum, r) => sum + r.total, 0);
  const finished = today.length;
  return [
    { id: 'lesson', label: 'Finish one lesson', progress: finished > 0 ? 'Done' : 'Not started', done: finished > 0 },
    {
      id: 'answers',
      label: 'Answer 5 questions',
      progress: answered >= 5 ? 'Done' : `${answered} of 5`,
      done: answered >= 5,
    },
  ];
}

const BADGES: Record<BadgeId, Badge> = {
  'first-lesson': { id: 'first-lesson', label: 'First lesson', icon: 'sun', tone: 'coral' },
  'perfect-quiz': { id: 'perfect-quiz', label: 'Perfect quiz', icon: 'star', tone: 'teal' },
  'streak-3': { id: 'streak-3', label: '3-day streak', icon: 'flame', tone: 'sun' },
  'streak-7': { id: 'streak-7', label: '7-day streak', icon: 'flame', tone: 'sun' },
  'story-time': { id: 'story-time', label: 'Story time', icon: 'storybook', tone: 'lavenderStrong' },
};

/** Badges the learner has really earned, in a fixed order. */
export function earnedBadges(results: LessonResult[], now: number): Badge[] {
  const earned: BadgeId[] = [];
  if (results.length > 0) earned.push('first-lesson');
  if (results.some((r) => r.total > 0 && r.correct === r.total)) earned.push('perfect-quiz');
  const streak = streakDays(results, now);
  if (streak >= 3) earned.push('streak-3');
  if (streak >= 7) earned.push('streak-7');
  if (results.some((r) => r.lessonId === 'stories-1')) earned.push('story-time');
  return earned.map((id) => BADGES[id]);
}

export type WeeklyReport = {
  headline: string;
  daysActive: number;
  lessonsFinished: number;
  /** Share of answers right this week, or null when nothing was answered. */
  accuracy: number | null;
  win: string | null;
  focus: string | null;
};

/** The last 7 days, including today. */
export function weeklyReport(name: string, results: LessonResult[], now: number): WeeklyReport {
  const week = results.filter((r) => {
    const age = daysBetween(now, r.at);
    return age >= 0 && age < 7;
  });

  if (week.length === 0) {
    return {
      headline: `${name} has not finished a lesson this week`,
      daysActive: 0,
      lessonsFinished: 0,
      accuracy: null,
      win: null,
      focus: null,
    };
  }

  const daysActive = new Set(week.map((r) => startOfDay(r.at))).size;
  const total = week.reduce((sum, r) => sum + r.total, 0);
  const correct = week.reduce((sum, r) => sum + r.correct, 0);
  const accuracy = total === 0 ? null : Math.round((correct / total) * 100);

  const perfect = week.find((r) => r.total > 0 && r.correct === r.total);
  const subjects = subjectProgress(week);
  const best = [...subjects].filter((s) => s.mastery !== null).sort((a, b) => (b.mastery ?? 0) - (a.mastery ?? 0))[0];
  const weakest = focusAreas(subjects, 1)[0];

  const win = perfect
    ? `a perfect score in ${subjects.find((s) => s.id === perfect.subjectId)?.name ?? 'a lesson'}.`
    : best
      ? `${best.mastery}% right in ${best.name}.`
      : null;

  return {
    headline: daysActive >= 3 ? `${name} had a good week` : `${name} has made a start this week`,
    daysActive,
    lessonsFinished: week.length,
    accuracy,
    win,
    focus: weakest ? `${weakest.name} (${weakest.mastery}% right so far).` : null,
  };
}
