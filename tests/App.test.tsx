import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/src/App';
import { getChapterById } from '@/src/content/chapters';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

describe('App chapter navigation', () => {
  it('starts on chapter 0 and renders its quiz', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /welcome & the big picture/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check answers/i })).toBeDisabled();
  });

  it('resets the quiz when moving to the next chapter', async () => {
    const user = userEvent.setup();
    render(<App />);

    const chapter0 = getChapterById(0)!;
    for (const q of chapter0.quiz) {
      await user.click(screen.getByText(q.options[q.correctIndex]));
    }
    await user.click(screen.getByRole('button', { name: /check answers/i }));
    expect(screen.getByText(/Score: 3\/3/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next: chapter 1/i }));

    expect(
      screen.getByRole('heading', { name: /what 'generative' means/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/Score:/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check answers/i })).toBeDisabled();
  });

  it('keeps each chapter quiz independent in localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);

    const chapter0 = getChapterById(0)!;
    for (const q of chapter0.quiz) {
      await user.click(screen.getByText(q.options[q.correctIndex]));
    }
    await user.click(screen.getByRole('button', { name: /check answers/i }));

    await user.click(screen.getByRole('button', { name: /next: chapter 1/i }));

    const chapter1 = getChapterById(1)!;
    for (const q of chapter1.quiz) {
      await user.click(screen.getByText(q.options[q.correctIndex]));
    }
    await user.click(screen.getByRole('button', { name: /check answers/i }));

    expect(localStorage.getItem('yue2_quiz_ch_0_submitted')).toBe('true');
    expect(localStorage.getItem('yue2_quiz_ch_1_submitted')).toBe('true');
    expect(screen.getByText(/Score: 3\/3/)).toBeInTheDocument();
  });
});
