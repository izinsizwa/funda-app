import { bandConfig, bandForGrade, gradeLabel } from '@/theme/bands';
import { themeKindFor } from '@/state/session';

describe('bandForGrade', () => {
  it.each([
    [0, 'foundation'],
    [3, 'foundation'],
    [4, 'intermediate'],
    [6, 'intermediate'],
    [7, 'senior'],
    [9, 'senior'],
  ])('grade %i is %s', (grade, band) => {
    expect(bandForGrade(grade)).toBe(band);
  });
});

describe('gradeLabel', () => {
  it('calls grade 0 Grade R', () => {
    expect(gradeLabel(0)).toBe('Grade R');
    expect(gradeLabel(7)).toBe('Grade 7');
  });
});

describe('bandConfig', () => {
  it('only reads questions aloud to the youngest band', () => {
    expect(bandConfig.foundation.lesson.speakPrompts).toBe(true);
    expect(bandConfig.intermediate.lesson.speakPrompts).toBe(false);
    expect(bandConfig.senior.lesson.speakPrompts).toBe(false);
  });
  it('skips explanations only for the youngest band', () => {
    expect(bandConfig.foundation.lesson.showExplanation).toBe(false);
    expect(bandConfig.senior.lesson.showExplanation).toBe(true);
  });
});

describe('themeKindFor', () => {
  it('uses the parent theme for parents and the band theme for learners', () => {
    expect(themeKindFor({ id: 'p', role: 'parent', name: 'P', tone: 'sun' })).toBe('parent');
    expect(themeKindFor({ id: 'l', role: 'learner', name: 'L', grade: 8, tone: 'sun' })).toBe('senior');
    expect(themeKindFor(undefined)).toBe('intermediate');
  });
});
