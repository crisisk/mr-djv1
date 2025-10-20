import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Footer from '../Footer.jsx';
import socialLinks from '../../../content/social.json';

describe('Footer', () => {
  it('renders contact links with accessible labels', () => {
    render(<Footer />);

    const phoneLink = screen.getByRole('link', { name: /bel mister dj via \+31 \(0\) 40 842 2594/i });
    expect(phoneLink).toHaveAttribute('href', 'tel:+31408422594');

    const emailLink = screen.getByRole('link', { name: /stuur een e-mail naar info@mr-dj.nl/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:info@mr-dj.nl');
  });

  it('renders social links from content data', () => {
    render(<Footer />);

    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    expect(facebookLink).toHaveAttribute('href', socialLinks.facebook);

    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    expect(instagramLink).toHaveAttribute('href', socialLinks.instagram);

    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toHaveAttribute('href', socialLinks.linkedin);
  });
});
