import { addLearner, createHousehold, isValidEmail, isValidPin, MAX_NAME_LENGTH } from '@/domain/household';

describe('isValidEmail', () => {
  it.each(['a@b.co', 'thandi@example.com', ' spaced@example.com '])('accepts %s', (e) => {
    expect(isValidEmail(e)).toBe(true);
  });
  it.each(['', 'nope', 'a@b', '@b.com', 'a b@c.com'])('rejects "%s"', (e) => {
    expect(isValidEmail(e)).toBe(false);
  });
});

describe('isValidPin', () => {
  it.each(['0000', '1234'])('accepts %s', (p) => expect(isValidPin(p)).toBe(true));
  it.each(['', '123', '12345', 'abcd', '12a4', '12 4'])('rejects "%s"', (p) => expect(isValidPin(p)).toBe(false));
});

describe('createHousehold', () => {
  it('starts empty on the free plan with one slot', () => {
    const h = createHousehold('  Parent@Example.com ');
    expect(h.email).toBe('parent@example.com');
    expect(h.learners).toEqual([]);
    expect(h.planName).toMatch(/free/i);
    expect(h.learnerSlots).toBe(1);
    expect(h.parent.role).toBe('parent');
  });
});

describe('addLearner', () => {
  const roomy = { ...createHousehold('p@example.com'), learnerSlots: 4 };

  it('adds a learner and trims the name', () => {
    const res = addLearner(roomy, { name: '  Sipho   Dlamini ', grade: 5 });
    if (!res.ok) throw new Error(res.error);
    expect(res.learner).toMatchObject({ name: 'Sipho Dlamini', grade: 5, role: 'learner' });
    expect(res.household.learners).toHaveLength(1);
    expect(roomy.learners).toHaveLength(0); // the original is not changed
  });
  it('accepts Grade R (0) and Grade 9', () => {
    expect(addLearner(roomy, { name: 'A', grade: 0 }).ok).toBe(true);
    expect(addLearner(roomy, { name: 'B', grade: 9 }).ok).toBe(true);
  });
  it.each([-1, 10, 2.5, NaN])('rejects grade %p', (grade) => {
    expect(addLearner(roomy, { name: 'Zed', grade }).ok).toBe(false);
  });
  it('rejects an empty or too-long name', () => {
    expect(addLearner(roomy, { name: '   ', grade: 3 }).ok).toBe(false);
    expect(addLearner(roomy, { name: 'x'.repeat(MAX_NAME_LENGTH + 1), grade: 3 }).ok).toBe(false);
  });
  it('rejects a duplicate name, ignoring case', () => {
    const first = addLearner(roomy, { name: 'Lee', grade: 3 });
    if (!first.ok) throw new Error(first.error);
    expect(addLearner(first.household, { name: 'lee', grade: 4 }).ok).toBe(false);
  });
  it('stops when the plan is full', () => {
    const full = createHousehold('p@example.com');
    const first = addLearner(full, { name: 'One', grade: 1 });
    if (!first.ok) throw new Error(first.error);
    const second = addLearner(first.household, { name: 'Two', grade: 2 });
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.error).toMatch(/plan is full/i);
  });
  it('gives each learner a unique id and rotating colours', () => {
    let h = roomy;
    for (const n of ['A', 'B', 'C', 'D']) {
      const res = addLearner(h, { name: n, grade: 1 });
      if (!res.ok) throw new Error(res.error);
      h = res.household;
    }
    expect(new Set(h.learners.map((l) => l.id)).size).toBe(4);
    expect(new Set(h.learners.map((l) => l.tone)).size).toBe(4);
  });
});
