import { useSession } from '@/state/session';

const s = () => useSession.getState();

function signInWithLearner(grade = 5, name = 'Thandi') {
  s().signIn('parent@example.com');
  const res = s().addLearner({ name, grade });
  if (!res.ok) throw new Error(res.error);
  return s().household!.learners[0];
}

describe('a new session', () => {
  it('starts signed out with no household, PIN or results', () => {
    expect(s()).toMatchObject({ signedIn: false, household: null, parentPin: null, results: [], activeProfileId: null });
  });
});

describe('signIn', () => {
  it('rejects a bad email and stays signed out', () => {
    const res = s().signIn('nope');
    expect(res.ok).toBe(false);
    expect(s().signedIn).toBe(false);
  });
  it('starts an empty household', () => {
    expect(s().signIn('parent@example.com').ok).toBe(true);
    expect(s().signedIn).toBe(true);
    expect(s().household?.learners).toEqual([]);
    expect(s().activeProfileId).toBeNull();
  });
  it('signOut wipes everything', () => {
    const l = signInWithLearner();
    s().createParentPin('1234');
    s().recordResult({ learnerId: l.id, lessonId: 'x', subjectId: 'maths', correct: 1, total: 2 });
    s().signOut();
    expect(s()).toMatchObject({ signedIn: false, household: null, parentPin: null, results: [] });
  });
});

describe('parent PIN', () => {
  beforeEach(() => {
    s().signIn('parent@example.com');
  });
  it('cannot be used before one is made, not even 1234', () => {
    expect(s().unlockParent('1234')).toBe(false);
    expect(s().activeProfileId).toBeNull();
  });
  it('rejects a PIN that is not 4 digits', () => {
    expect(s().createParentPin('12').ok).toBe(false);
    expect(s().parentPin).toBeNull();
  });
  it('unlocks with the right PIN only', () => {
    s().createParentPin('4821');
    expect(s().unlockParent('1234')).toBe(false);
    expect(s().activeProfileId).toBeNull();
    expect(s().unlockParent('4821')).toBe(true);
    expect(s().activeProfileId).toBe('parent');
  });
});

describe('profiles', () => {
  it('addLearner fails when signed out', () => {
    expect(s().addLearner({ name: 'A', grade: 1 }).ok).toBe(false);
  });
  it('selects a real learner but ignores unknown ids', () => {
    const l = signInWithLearner();
    s().selectLearner('ghost');
    expect(s().activeProfileId).toBeNull();
    s().selectLearner(l.id);
    expect(s().activeProfileId).toBe(l.id);
    s().leaveProfile();
    expect(s().activeProfileId).toBeNull();
  });
  it('keeps a failed add from changing the household', () => {
    signInWithLearner();
    expect(s().addLearner({ name: 'Second', grade: 2 }).ok).toBe(false); // free plan has 1 slot
    expect(s().household?.learners).toHaveLength(1);
  });
});

describe('recordResult', () => {
  it('stores a result for a real learner with a timestamp', () => {
    const l = signInWithLearner();
    s().recordResult({ learnerId: l.id, lessonId: 'fractions-1', subjectId: 'maths', correct: 2, total: 3 });
    expect(s().results).toHaveLength(1);
    expect(s().results[0].at).toBeGreaterThan(0);
  });
  it('ignores results for unknown learners and empty lessons', () => {
    const l = signInWithLearner();
    s().recordResult({ learnerId: 'ghost', lessonId: 'x', subjectId: 'maths', correct: 1, total: 1 });
    s().recordResult({ learnerId: l.id, lessonId: 'x', subjectId: 'maths', correct: 0, total: 0 });
    expect(s().results).toEqual([]);
  });
  it('keeps the score between 0 and the total', () => {
    const l = signInWithLearner();
    s().recordResult({ learnerId: l.id, lessonId: 'x', subjectId: 'maths', correct: 9, total: 3 });
    s().recordResult({ learnerId: l.id, lessonId: 'x', subjectId: 'maths', correct: -2, total: 3 });
    expect(s().results.map((r) => r.correct)).toEqual([3, 0]);
  });
});
