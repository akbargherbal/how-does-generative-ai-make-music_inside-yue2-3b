import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GlossaryView } from '@/src/components/views/GlossaryView';

describe('GlossaryView', () => {
  it('renders every glossary term', () => {
    render(<GlossaryView onSelectChapter={vi.fn()} />);
    expect(screen.getByText('Token')).toBeInTheDocument();
    expect(screen.getByText('Flow Matching')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(65);
  });

  it('filters terms by search query across definitions and analogies', async () => {
    const user = userEvent.setup();
    render(<GlossaryView onSelectChapter={vi.fn()} />);

    await user.type(screen.getByPlaceholderText(/search all 65 terms/i), 'barcode scanner');

    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(1);
    expect(articles[0]).toHaveTextContent('Tokenizer');
  });

  it('filters terms by first letter', async () => {
    const user = userEvent.setup();
    render(<GlossaryView onSelectChapter={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'T' }));

    const articles = screen.getAllByRole('article');
    expect(articles.length).toBeGreaterThan(0);
    articles.forEach((article) => {
      expect(article.querySelector('h2')?.textContent?.trim().startsWith('T')).toBe(true);
    });
  });

  it('navigates to a chapter when the "first seen" link is clicked', async () => {
    const user = userEvent.setup();
    const onSelectChapter = vi.fn();
    render(<GlossaryView onSelectChapter={onSelectChapter} />);

    await user.click(screen.getAllByRole('button', { name: /chapter 3/i })[0]);

    expect(onSelectChapter).toHaveBeenCalledWith(3);
  });

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<GlossaryView onSelectChapter={vi.fn()} />);

    await user.type(screen.getByPlaceholderText(/search all 65 terms/i), 'zzzzzz-no-match');

    expect(screen.getByText(/no terms found matching/i)).toBeInTheDocument();
  });
});
