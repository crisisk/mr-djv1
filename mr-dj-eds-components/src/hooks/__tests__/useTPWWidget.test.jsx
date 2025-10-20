import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../services/tpwWidget', () => {
  return {
    initializeWidget: vi.fn(() => Promise.resolve()),
    destroyWidget: vi.fn(),
  };
});

import useTPWWidget from '../useTPWWidget.js';
import { initializeWidget, destroyWidget } from '../../services/tpwWidget';

describe('useTPWWidget hook', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  function TestComponent({ widgetType = 'booking' }) {
    const { containerRef, containerId } = useTPWWidget(widgetType);

    return (
      <div>
        <div data-testid="tpw-container" data-container-id={containerId} ref={containerRef} />
      </div>
    );
  }

  it('initializes the TPW widget with the generated container id', async () => {
    render(<TestComponent widgetType="reviews" />);

    const container = await screen.findByTestId('tpw-container');
    const containerId = container.getAttribute('data-container-id');

    await waitFor(() => {
      expect(initializeWidget).toHaveBeenCalledWith(containerId, 'reviews');
    });
  });

  it('cleans up the widget on unmount with the same container id', async () => {
    const { unmount } = render(<TestComponent widgetType="calendar" />);

    const container = await screen.findByTestId('tpw-container');
    const containerId = container.getAttribute('data-container-id');

    await waitFor(() => {
      expect(initializeWidget).toHaveBeenCalledWith(containerId, 'calendar');
    });

    unmount();

    await waitFor(() => {
      expect(destroyWidget).toHaveBeenCalledWith(containerId);
    });
  });
});
