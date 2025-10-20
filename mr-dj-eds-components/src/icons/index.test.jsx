import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import {
  Icon,
  icons,
  WeddingIcon,
  CorporateIcon,
  PrivatePartyIcon,
  SaxIcon,
} from './index.jsx';

const EXPECTED_ICON_KEYS = [
  'icon-wedding',
  'icon-corporate',
  'icon-private-party',
  'icon-sax',
  'icon-headphones',
  'icon-dj-booth',
  'icon-festival',
  'icon-sparkles',
  'icon-star',
  'icon-dancer',
  'icon-location',
  'icon-calendar',
  'icon-music',
  'icon-refresh',
  'icon-badge',
  'icon-microphone',
  'icon-camera',
  'icon-tv',
  'icon-party',
  'icon-masks',
  'icon-graduation',
  'icon-car',
  'icon-volume',
  'icon-briefcase',
  'icon-target',
  'icon-handshake',
  'icon-lightbulb',
  'icon-quote',
  'icon-facebook',
  'icon-linkedin',
  'icon-spotify',
  'icon-youtube',
];

describe('icons registry', () => {
  it('exports the expected icon keys', () => {
    expect(Object.keys(icons).sort()).toEqual([...EXPECTED_ICON_KEYS].sort());
  });

  it('renders each icon without crashing', () => {
    EXPECTED_ICON_KEYS.forEach((key) => {
      const IconComponent = icons[key];
      const { container, unmount } = render(<IconComponent data-testid={key} />);
      expect(container.querySelector('svg')).toBeTruthy();
      unmount();
    });
  });

  it('renders the Icon helper with a valid key', () => {
    const { container } = render(<Icon name="icon-wedding" />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('returns fallback when icon is missing', () => {
    const fallback = 'fallback-icon';
    const { getByText } = render(<Icon name="unknown" fallback={fallback} />);
    expect(getByText(fallback)).toBeTruthy();
  });

  it('exposes direct components for core icons', () => {
    [WeddingIcon, CorporateIcon, PrivatePartyIcon, SaxIcon].forEach((Component) => {
      const { container, unmount } = render(<Component />);
      expect(container.querySelector('svg')).toBeTruthy();
      unmount();
    });
  });
});
