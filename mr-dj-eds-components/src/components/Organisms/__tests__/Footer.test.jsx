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

  it('renders social links from content data when provided', () => {
    render(<Footer />);

    const labelMap = {
      facebook: /facebook/i,
      instagram: /instagram/i,
      linkedin: /linkedin/i,
      youtube: /you\s*tube/i,
      tiktok: /tiktok/i,
      twitter: /twitter/i
    };

    const configuredPlatforms = Object.entries(socialLinks).filter(([, url]) => typeof url === 'string' && url.trim() !== '');

    configuredPlatforms.forEach(([platform, url]) => {
      const matcher = labelMap[platform];
      expect(matcher).toBeDefined();

      const link = screen.getByRole('link', { name: matcher });
      expect(link).toHaveAttribute('href', url);
    });

    Object.entries(labelMap).forEach(([platform, matcher]) => {
      if (!configuredPlatforms.some(([configured]) => configured === platform)) {
        expect(screen.queryByRole('link', { name: matcher })).not.toBeInTheDocument();
      }
    });
  });
});
