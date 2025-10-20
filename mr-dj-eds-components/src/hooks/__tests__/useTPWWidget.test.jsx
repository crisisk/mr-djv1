import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, waitFor, act, cleanup } from '@testing-library/react';
import React from 'react';

const initializeWidgetMock = vi.fn().mockResolvedValue(undefined);
const destroyWidgetMock = vi.fn();

vi.mock('../../services/tpwWidget', () => ({
  initializeWidget: initializeWidgetMock,
  destroyWidget: destroyWidgetMock,
}));

import { useTPWWidget } from '../useTPWWidget.js';

describe('useTPWWidget hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const HookHarness = ({ widgetType = 'booking' }) => {
    const { containerRef, containerId } = useTPWWidget(widgetType);

    return <div data-testid="tpw-container" id={containerId} ref={containerRef} />;
  };

  it('initializes the widget with the generated container id and widget type', async () => {
    const { getByTestId } = render(<HookHarness widgetType="calendar" />);

    await waitFor(() => expect(initializeWidgetMock).toHaveBeenCalledTimes(1));

    const container = getByTestId('tpw-container');
    const [[containerIdArg, widgetTypeArg]] = initializeWidgetMock.mock.calls;

    expect(container.id).toBe(containerIdArg);
    expect(widgetTypeArg).toBe('calendar');
  });

  it('destroys the widget with the same container id on unmount when loaded', async () => {
    const { unmount, getByTestId } = render(<HookHarness widgetType="booking" />);

    await waitFor(() => expect(initializeWidgetMock).toHaveBeenCalledTimes(1));

    const containerId = getByTestId('tpw-container').id;

    await act(async () => {
      unmount();
    });

    await waitFor(() => {
      expect(destroyWidgetMock).toHaveBeenCalledWith(containerId);
    });
  });
});
