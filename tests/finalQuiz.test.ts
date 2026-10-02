import { describe, expect, it } from 'vitest';
import { FINAL_QUIZ_QUESTIONS } from '@/src/content/finalQuiz';

describe('comprehensive final exam', () => {
  it('contains exactly 10 questions with unique ids', () => {
    expect(FINAL_QUIZ_QUESTIONS).toHaveLength(10);
    const ids = FINAL_QUIZ_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a valid correct answer index and explanation for every question', () => {
    FINAL_QUIZ_QUESTIONS.forEach((q) => {
      expect(q.question.trim().length).toBeGreaterThan(10);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(q.explanation.trim().length).toBeGreaterThan(10);
    });
  });
});
