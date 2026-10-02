import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import confetti from 'canvas-confetti';
import { Quiz } from '@/src/components/common/Quiz';
import { getChapterById } from '@/src/content/chapters';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

const chapter = getChapterById(0)!;
const questions = chapter.quiz;

describe('Quiz', () => {
  beforeEach(() => {
    vi.mocked(confetti).mockClear();
  });

  it('renders a question and all of its options', () => {
    render(<Quiz chapterId={0} questions={questions} />);
    expect(screen.getByText(questions[0].question)).toBeInTheDocument();
    questions[0].options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('keeps the submit button disabled until every question is answered', async () => {
    const user = userEvent.setup();
    render(<Quiz chapterId={0} questions={questions} />);

    const submit = screen.getByRole('button', { name: /check answers/i });
    expect(submit).toBeDisabled();

    await user.click(screen.getByText(questions[0].options[0]));
    expect(submit).toBeDisabled();
  });

  it('scores a perfect run, fires confetti and reports completion', async () => {
    const user = userEvent.setup();
    const onQuizComplete = vi.fn();
    render(<Quiz chapterId={0} questions={questions} onQuizComplete={onQuizComplete} />);

    for (const q of questions) {
      await user.click(screen.getByText(q.options[q.correctIndex]));
    }

    const submit = screen.getByRole('button', { name: /check answers/i });
    expect(submit).toBeEnabled();
    await user.click(submit);

    expect(screen.getByText(/Score: 3\/3/)).toBeInTheDocument();
    expect(onQuizComplete).toHaveBeenCalledWith(3);
    expect(confetti).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('yue2_quiz_ch_0_submitted')).toBe('true');
  });

  it('persists selected answers to localStorage', async () => {
    const user = userEvent.setup();
    render(<Quiz chapterId={0} questions={questions} />);

    await user.click(screen.getByText(questions[1].options[0]));

    expect(JSON.parse(localStorage.getItem('yue2_quiz_ch_0')!)).toEqual({ 1: 0 });
  });

  it('hydrates a previously submitted quiz from localStorage', () => {
    localStorage.setItem('yue2_quiz_ch_0', JSON.stringify({ 0: 1, 1: 1, 2: 2 }));
    localStorage.setItem('yue2_quiz_ch_0_submitted', 'true');

    render(<Quiz chapterId={0} questions={questions} />);

    expect(screen.getByText(/Score: 3\/3/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /check answers/i })).not.toBeInTheDocument();
  });

  it('resets answers and clears storage when trying again', async () => {
    const user = userEvent.setup();
    localStorage.setItem('yue2_quiz_ch_0', JSON.stringify({ 0: 1, 1: 1, 2: 2 }));
    localStorage.setItem('yue2_quiz_ch_0_submitted', 'true');

    render(<Quiz chapterId={0} questions={questions} />);
    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(localStorage.getItem('yue2_quiz_ch_0')).toBeNull();
    expect(localStorage.getItem('yue2_quiz_ch_0_submitted')).toBeNull();
    expect(screen.getByRole('button', { name: /check answers/i })).toBeDisabled();
  });
});
