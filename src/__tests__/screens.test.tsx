import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

import { ReportCard } from '@/components/parent/ReportCard';
import { FoundationHome } from '@/components/home/FoundationHome';
import { IntermediateHome } from '@/components/home/IntermediateHome';
import { SeniorHome } from '@/components/home/SeniorHome';
import AddLearner from '@/app/add-learner';
import Learn from '@/app/learner/learn';
import ParentHome from '@/app/parent';
import ParentPin from '@/app/parent-pin';
import Reports from '@/app/parent/reports';
import SignIn from '@/app/sign-in';
import WhoIsLearning from '@/app/who-is-learning';
import { useSession } from '@/state/session';
import { ThemeProvider } from '@/theme/ThemeProvider';
import type { ThemeKind } from '@/theme/bands';

const mockRouter = { push: jest.fn(), back: jest.fn(), replace: jest.fn(), canGoBack: () => true };
jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => ({}),
  Redirect: () => null,
}));
jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);
jest.mock('expo-speech', () => ({ speak: jest.fn(), stop: jest.fn() }));

const s = () => useSession.getState();

/** Words from the old sample family and numbers that used to be hard-coded. */
const DEMO_STRINGS = ['Sne', 'Lwazi', 'Ayanda', 'Aphiwe', 'Demo', '1234', '23 days', 'Algebraic', 'Matter and materials', '62%', '8 of 12'];

function expectNoDemoData() {
  for (const text of DEMO_STRINGS) expect(screen.queryByText(text, { exact: false })).toBeNull();
}

const inTheme = (kind: ThemeKind, ui: React.ReactElement) => <ThemeProvider kind={kind}>{ui}</ThemeProvider>;

function setUp(grade: number, name = 'Thandi') {
  s().signIn('parent@example.com');
  const res = s().addLearner({ name, grade });
  if (!res.ok) throw new Error(res.error);
  const learner = s().household!.learners[0];
  s().selectLearner(learner.id);
  return learner;
}

beforeEach(() => jest.clearAllMocks());

describe('sign in', () => {
  it('shows an error for a bad email and does not sign in', async () => {
    await render(inTheme('intermediate', <SignIn />));
    await fireEvent.changeText(screen.getByLabelText('Parent email'), 'nope');
    await fireEvent.press(screen.getByText('Get started'));
    expect(screen.getByText(/valid email/i)).toBeTruthy();
    expect(s().signedIn).toBe(false);
  });
  it('starts an empty household with a good email', async () => {
    await render(inTheme('intermediate', <SignIn />));
    await fireEvent.changeText(screen.getByLabelText('Parent email'), 'parent@example.com');
    await fireEvent.press(screen.getByText('Get started'));
    expect(s().signedIn).toBe(true);
    expect(s().household?.learners).toEqual([]);
    expectNoDemoData();
  });
});

describe('who is learning', () => {
  it('shows an empty state, not a sample family', async () => {
    s().signIn('parent@example.com');
    await render(inTheme('intermediate', <WhoIsLearning />));
    expect(screen.getByText('No learners yet')).toBeTruthy();
    expectNoDemoData();
  });
  it('lists only the learners that were added', async () => {
    setUp(2, 'Zinhle');
    s().leaveProfile();
    await render(inTheme('intermediate', <WhoIsLearning />));
    expect(screen.getByText('Zinhle')).toBeTruthy();
    expect(screen.getByText('Grade 2')).toBeTruthy();
    expect(screen.queryByText('No learners yet')).toBeNull();
  });
});

describe('parent PIN', () => {
  const tap = async (digits: string) => {
    for (const d of digits) await fireEvent.press(screen.getByLabelText(d));
  };

  it('asks a new parent to make a PIN and never shows one', async () => {
    s().signIn('parent@example.com');
    await render(<ParentPin />);
    expect(screen.getByText('Make a parent PIN')).toBeTruthy();
    expect(screen.queryByText(/demo/i)).toBeNull();
    expect(screen.queryByText(/1234/)).toBeNull();
  });
  it('saves the PIN when it is typed twice the same, and unlocks', async () => {
    s().signIn('parent@example.com');
    await render(<ParentPin />);
    await tap('4821');
    expect(await screen.findByText(/same 4 numbers again/i)).toBeTruthy();
    await tap('4821');
    expect(s().parentPin).toBe('4821');
    expect(s().activeProfileId).toBe('parent');
  });
  it('does not save the PIN when the two do not match', async () => {
    s().signIn('parent@example.com');
    await render(<ParentPin />);
    await tap('4821');
    await tap('1111');
    expect(await screen.findByText(/did not match/i)).toBeTruthy();
    expect(s().parentPin).toBeNull();
  });
  it('rejects a wrong PIN once one exists', async () => {
    s().signIn('parent@example.com');
    s().createParentPin('4821');
    await render(<ParentPin />);
    expect(screen.getByText('Parent area')).toBeTruthy();
    await tap('1234');
    expect(await screen.findByText(/not right/i)).toBeTruthy();
    expect(s().activeProfileId).toBeNull();
  });
});

describe('parent screens with nothing added yet', () => {
  beforeEach(() => {
    s().signIn('parent@example.com');
    s().createParentPin('4821');
    s().unlockParent('4821');
  });
  it('home asks for a first learner', async () => {
    await render(inTheme('parent', <ParentHome />));
    expect(screen.getByText('Add your first learner')).toBeTruthy();
    expect(screen.getByLabelText('Add a learner')).toBeTruthy();
    expectNoDemoData();
  });
  it('reports show an empty message', async () => {
    await render(inTheme('parent', <Reports />));
    expect(screen.getByText(/Add a learner on the Home tab/)).toBeTruthy();
    expectNoDemoData();
  });
  it('hides the WhatsApp settings and messages while they are not real', async () => {
    await render(inTheme('parent', <ParentHome />));
    expect(screen.queryByText('Send to WhatsApp')).toBeNull();
    expect(screen.queryByText('Message the tutor')).toBeNull();
  });
});

describe('add learner screen', () => {
  beforeEach(() => {
    s().signIn('parent@example.com');
    s().createParentPin('4821');
    s().unlockParent('4821');
  });
  it('asks for a grade before saving', async () => {
    await render(inTheme('parent', <AddLearner />));
    await fireEvent.changeText(screen.getByLabelText('First name'), 'Thandi');
    await fireEvent.press(screen.getByText('Save learner'));
    expect(screen.getByText('Please choose a grade.')).toBeTruthy();
    expect(s().household?.learners).toEqual([]);
  });
  it('asks for a name', async () => {
    await render(inTheme('parent', <AddLearner />));
    await fireEvent.press(screen.getByLabelText('Grade 4'));
    await fireEvent.press(screen.getByText('Save learner'));
    expect(screen.getByText('Please type a name.')).toBeTruthy();
  });
  it('saves a learner and goes back', async () => {
    await render(inTheme('parent', <AddLearner />));
    await fireEvent.changeText(screen.getByLabelText('First name'), 'Thandi');
    await fireEvent.press(screen.getByLabelText('Grade R'));
    await fireEvent.press(screen.getByText('Save learner'));
    expect(s().household?.learners[0]).toMatchObject({ name: 'Thandi', grade: 0 });
    expect(mockRouter.back).toHaveBeenCalled();
  });
});

describe('a brand-new learner sees zeros and empty states', () => {
  it('Grade R: no stars', async () => {
    setUp(0);
    await render(inTheme('foundation', <FoundationHome />));
    expect(screen.getByLabelText('0 stars collected')).toBeTruthy();
    expect(screen.getByText('0 of 5')).toBeTruthy();
    expectNoDemoData();
  });
  it('Grade 5: no streak, no badges, subjects not started, no ask card', async () => {
    setUp(5);
    await render(inTheme('intermediate', <IntermediateHome />));
    expect(screen.getByText('0 days')).toBeTruthy();
    expect(screen.getByText('Level 1')).toBeTruthy();
    expect(screen.getByText('Finish a lesson to earn your first badge.')).toBeTruthy();
    expect(screen.getAllByText('Not started').length).toBeGreaterThan(0);
    expect(screen.queryByText('Ask Funi')).toBeNull();
    expectNoDemoData();
  });
  it('Grade 8: nothing scheduled, no focus areas, no ask box', async () => {
    setUp(8);
    await render(inTheme('senior', <SeniorHome />));
    expect(screen.getByText(/Nothing scheduled yet/)).toBeTruthy();
    expect(screen.getByText(/subjects that need practice will show here/)).toBeTruthy();
    expect(screen.queryByLabelText('Ask your tutor a question')).toBeNull();
    expect(screen.queryByLabelText('Notifications')).toBeNull();
    expectNoDemoData();
  });
  it('Learn tab (older learners) shows every subject as not started', async () => {
    setUp(6);
    await render(inTheme('intermediate', <Learn />));
    expect(screen.getAllByText('Not started')).toHaveLength(6);
  });
  it('report card says there is nothing yet', async () => {
    const learner = setUp(6);
    await render(inTheme('parent', <ReportCard learner={learner} />));
    expect(screen.getByText(/has not finished a lesson this week/)).toBeTruthy();
    expect(screen.getByText('-')).toBeTruthy();
    expect(screen.getByText(/will show here/)).toBeTruthy();
    expectNoDemoData();
  });
});

describe('screens show real progress once a lesson is finished', () => {
  it('Grade 5 sees a streak, badges and a subject score', async () => {
    const learner = setUp(5);
    s().recordResult({ learnerId: learner.id, lessonId: 'fractions-1', subjectId: 'maths', correct: 3, total: 3 });
    await render(inTheme('intermediate', <IntermediateHome />));
    expect(screen.getByText('1 day')).toBeTruthy();
    expect(screen.getByText('First lesson')).toBeTruthy();
    expect(screen.getByText('Perfect quiz')).toBeTruthy();
    expect(screen.getByText('Strong')).toBeTruthy();
  });
  it('Grade R sees earned stars', async () => {
    const learner = setUp(1);
    s().recordResult({ learnerId: learner.id, lessonId: 'counting-1', subjectId: 'maths', correct: 3, total: 3 });
    await render(inTheme('foundation', <FoundationHome />));
    expect(screen.getByLabelText('3 stars collected')).toBeTruthy();
    expect(screen.getByText('3 of 5')).toBeTruthy();
  });
  it('Grade 8 sees a focus area for a weak subject and can practise it', async () => {
    const learner = setUp(8);
    s().recordResult({ learnerId: learner.id, lessonId: 'fractions-1', subjectId: 'maths', correct: 1, total: 3 });
    await render(inTheme('senior', <SeniorHome />));
    expect(screen.getByText('33%')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText('Practise Maths'));
    expect(mockRouter.push).toHaveBeenCalledWith('/lesson/fractions-1');
  });
  it('the report card shows this week from the learner results', async () => {
    const learner = setUp(6);
    s().recordResult({ learnerId: learner.id, lessonId: 'fractions-1', subjectId: 'maths', correct: 3, total: 3 });
    await render(inTheme('parent', <ReportCard learner={learner} />));
    expect(screen.getByText('100%')).toBeTruthy();
    expect(screen.getByText(/perfect score in Maths/)).toBeTruthy();
  });
});
