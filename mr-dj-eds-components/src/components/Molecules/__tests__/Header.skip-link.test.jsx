import { describe, expect, it } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import Header from '../Header.jsx';

describe('Header accessibility skip link', () => {
  it('allows keyboard users to skip to the main content', () => {
    render(
      <>
        <Header />
        <main id="main-content" tabIndex={-1}>
          Main content
        </main>
      </>
    );

    const skipLink = screen.getByText(/skip to main content/i);
    skipLink.focus();
    expect(document.activeElement).toBe(skipLink);

    fireEvent.click(skipLink);

    const mainContent = screen.getByRole('main');
    expect(document.activeElement).toBe(mainContent);
  });
});
