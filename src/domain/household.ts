import type { AvatarTone, Household, Profile } from '@/data/types';

export const PARENT_ID = 'parent';
export const MAX_NAME_LENGTH = 20;
export const MIN_GRADE = 0;
export const MAX_GRADE = 9;

const TONES: AvatarTone[] = ['sun', 'teal', 'coral', 'lavenderStrong'];

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** A parent PIN is exactly four digits. */
export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

export function createHousehold(email: string): Household {
  return {
    parent: { id: PARENT_ID, role: 'parent', name: 'Parent', tone: 'lavenderStrong' },
    email: email.trim().toLowerCase(),
    learners: [],
    // Everyone starts on the free plan. Paid plans are bought on the website.
    planName: 'Starter (free)',
    learnerSlots: 1,
  };
}

export type AddLearnerResult = { ok: true; household: Household; learner: Profile } | { ok: false; error: string };

export function addLearner(household: Household, input: { name: string; grade: number }): AddLearnerResult {
  const name = input.name.trim().replace(/\s+/g, ' ');
  if (!name) return { ok: false, error: 'Please type a name.' };
  if (name.length > MAX_NAME_LENGTH) return { ok: false, error: `Names can be up to ${MAX_NAME_LENGTH} letters.` };
  if (!Number.isInteger(input.grade) || input.grade < MIN_GRADE || input.grade > MAX_GRADE) {
    return { ok: false, error: 'Please choose a grade from R to 9.' };
  }
  if (household.learners.length >= household.learnerSlots) {
    return { ok: false, error: 'Your plan is full. You can add more learners on our website.' };
  }
  if (household.learners.some((l) => l.name.toLowerCase() === name.toLowerCase())) {
    return { ok: false, error: 'There is already a learner with that name.' };
  }

  // Ids never repeat, even after a learner is removed later.
  const used = new Set(household.learners.map((l) => l.id));
  let n = household.learners.length + 1;
  while (used.has(`learner-${n}`)) n += 1;
  const learner: Profile = {
    id: `learner-${n}`,
    role: 'learner',
    name,
    grade: input.grade,
    tone: TONES[household.learners.length % TONES.length],
  };
  return { ok: true, learner, household: { ...household, learners: [...household.learners, learner] } };
}
