import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Term } from '@/src/components/common/Term';
import { GLOSSARY } from '@/src/content/glossary';

describe('Term', () => {
  it('renders the term name as an interactive trigger', () => {
    render(<Term id="token" />);
    expect(screen.getByRole('button', { name: /definition for Token/i })).toBeInTheDocument();
  });

  it('opens a popover containing the definition, analogy and Python parallel', async () => {
    const user = userEvent.setup();
    render(<Term id="token" />);

    await user.hover(screen.getByRole('button', { name: /definition for Token/i }));

    const dialog = screen.getByRole('dialog', { name: 'Token' });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(GLOSSARY.token.definition);
    expect(dialog).toHaveTextContent(GLOSSARY.token.analogy);
    expect(dialog).toHaveTextContent(GLOSSARY.token.pythonAnalogy);
  });

  it('closes the popover when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<Term id="token" />);

    await user.hover(screen.getByRole('button', { name: /definition for Token/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('invokes the glossary navigation callback with the term id', async () => {
    const user = userEvent.setup();
    const onNavigateToGlossary = vi.fn();
    render(<Term id="token" onNavigateToGlossary={onNavigateToGlossary} />);

    await user.hover(screen.getByRole('button', { name: /definition for Token/i }));
    await user.click(screen.getByRole('button', { name: /more in glossary/i }));

    expect(onNavigateToGlossary).toHaveBeenCalledWith('token');
  });

  it('falls back to plain text for an unknown term id', () => {
    render(<Term id="not-a-real-term">Fallback text</Term>);
    expect(screen.getByText('Fallback text')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
