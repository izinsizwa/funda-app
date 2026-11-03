import { useMemo } from 'react';
import { create } from 'zustand';

import type { Household, LessonResult, Profile } from '@/data/types';
import { addLearner, createHousehold, isValidEmail, isValidPin, PARENT_ID } from '@/domain/household';
import {
  earnedBadges,
  levelFor,
  missionsToday,
  starsToday,
  streakDays,
  subjectProgress,
  totalStars,
  weeklyReport,
} from '@/domain/progress';
import { bandForGrade, type Band, type ThemeKind } from '@/theme/bands';

type Outcome = { ok: true } | { ok: false; error: string };

export type SessionState = {
  signedIn: boolean;
  household: Household | null;
  /** The parent's 4-digit PIN. null until the parent creates one. */
  parentPin: string | null;
  results: LessonResult[];
  /** Which profile is using the phone right now. null = show "Who's learning?". */
  activeProfileId: string | null;

  /** Starts a household on this phone. The real one calls the backend. */
  signIn: (email: string) => Outcome;
  signOut: () => void;
  selectLearner: (id: string) => void;
  /** Go back to the profile picker. */
  leaveProfile: () => void;
  createParentPin: (pin: string) => Outcome;
  /** Switches to the parent profile when the PIN is right. */
  unlockParent: (pin: string) => boolean;
  addLearner: (input: { name: string; grade: number }) => Outcome;
  recordResult: (r: Omit<LessonResult, 'at'> & { at?: number }) => void;
};

const initial = {
  signedIn: false,
  household: null,
  parentPin: null,
  results: [] as LessonResult[],
  activeProfileId: null,
};

export const useSession = create<SessionState>((set, get) => ({
  ...initial,

  signIn: (email) => {
    if (!isValidEmail(email)) return { ok: false, error: 'Please type a valid email address.' };
    set({ ...initial, signedIn: true, household: createHousehold(email) });
    return { ok: true };
  },
  signOut: () => set({ ...initial }),
  selectLearner: (id) => {
    const h = get().household;
    if (h?.learners.some((l) => l.id === id)) set({ activeProfileId: id });
  },
  leaveProfile: () => set({ activeProfileId: null }),

  createParentPin: (pin) => {
    if (!isValidPin(pin)) return { ok: false, error: 'A PIN is 4 numbers.' };
    set({ parentPin: pin });
    return { ok: true };
  },
  unlockParent: (pin) => {
    // A convenience gate for a shared phone. Anything sensitive (billing,
    // deleting a learner) is re-checked by the server behind the real login.
    const { parentPin } = get();
    if (parentPin === null || pin !== parentPin) return false;
    set({ activeProfileId: PARENT_ID });
    return true;
  },

  addLearner: (input) => {
    const h = get().household;
    if (!h) return { ok: false, error: 'Please sign in first.' };
    const res = addLearner(h, input);
    if (!res.ok) return res;
    set({ household: res.household });
    return { ok: true };
  },

  recordResult: (r) => {
    const { household } = get();
    if (!household?.learners.some((l) => l.id === r.learnerId)) return;
    if (r.total <= 0) return;
    const correct = Math.min(Math.max(0, r.correct), r.total);
    set((s) => ({ results: [...s.results, { ...r, correct, at: r.at ?? Date.now() }] }));
  },
}));

export function useActiveProfile(): Profile | undefined {
  return useSession((s) => {
    const h = s.household;
    if (!h || !s.activeProfileId) return undefined;
    if (s.activeProfileId === h.parent.id) return h.parent;
    return h.learners.find((l) => l.id === s.activeProfileId);
  });
}

/** The active learner. Only call inside screens guarded to learners. */
export function useLearner(): Profile {
  const profile = useActiveProfile();
  const fallback = useSession((s) => s.household?.learners[0]);
  const learner = profile?.role === 'learner' ? profile : fallback;
  if (!learner) throw new Error('useLearner was used with no learner available');
  return learner;
}

export function useBand(): Band {
  return bandForGrade(useLearner().grade ?? 4);
}

/** Which theme the active profile should see. */
export function themeKindFor(profile: Profile | undefined): ThemeKind {
  if (!profile) return 'intermediate';
  if (profile.role === 'parent') return 'parent';
  return bandForGrade(profile.grade ?? 4);
}

/** Everything calculated from one learner's real results. */
export function useProgress(learner: Profile) {
  const all = useSession((s) => s.results);
  return useMemo(() => {
    const now = Date.now();
    const results = all.filter((r) => r.learnerId === learner.id);
    return {
      results,
      stars: totalStars(results),
      starsToday: starsToday(results, now),
      streak: streakDays(results, now),
      level: levelFor(results),
      subjects: subjectProgress(results),
      missions: missionsToday(results, now),
      badges: earnedBadges(results, now),
      report: weeklyReport(learner.name, results, now),
    };
  }, [all, learner.id, learner.name]);
}
