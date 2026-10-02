import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import confetti from 'canvas-confetti';
import { FinalQuizView } from '@/src/components/views/FinalQuizView';
import { FINAL_QUIZ_QUESTIONS } from '@/src/content/finalQuiz';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

describe('FinalQuizView', () => {
  it('renders all 10 questions with a disabled submit button', () => {
    render(<FinalQuizView onSelectChapter={vi.fn()} />);

    expect(screen.getByText(/comprehensive final exam/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit final exam \(0\/10 answered\)/i })).toBeDisabled();
  });

  it('awards a perfect score and confetti when all answers are correct', async () => {
    const user = userEvent.setup();
    render(<FinalQuizView onSelectChapter={vi.fn()} />);

    for (const q of FINAL_QUIZ_QUESTIONS) {
      await user.click(screen.getByText(q.options[q.correctIndex]));
    }

    const submit = screen.getByRole('button', { name: /submit final exam \(10\/10 answered\)/i });
    expect(submit).toBeEnabled();
    await user.click(submit);

    expect(screen.getByText(/flawless score: 10\/10/i)).toBeInTheDocument();
    expect(confetti).toHaveBeenCalledTimes(1);
  });

  it('lets the learner retake the exam, clearing every answer', async () => {
    const user = userEvent.setup();
    render(<FinalQuizView onSelectChapter={vi.fn()} />);

    for (const q of FINAL_QUIZ_QUESTIONS) {
      await user.click(screen.getByText(q.options[q.correctIndex]));
    }
    await user.click(screen.getByRole('button', { name: /submit final exam/i }));

    await user.click(screen.getByRole('button', { name: /retake final exam/i }));

    expect(screen.getByRole('button', { name: /submit final exam \(0\/10 answered\)/i })).toBeDisabled();
  });
});
