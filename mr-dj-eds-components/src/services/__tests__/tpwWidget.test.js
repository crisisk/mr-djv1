import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const API_ERROR = 'TPW API key ontbreekt. Stel VITE_TPW_API_KEY in om de TPW widget te laden.';

describe('tpwWidget service', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    document.body.innerHTML = '';
    document.head.innerHTML = '';

    // Ensure window and TPWWidget mocks exist
    global.window = window;
    window.TPWWidget = {
      init: vi.fn(),
      render: vi.fn(),
      destroy: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    delete window.TPWWidget;
  });

  it('returns the correct widget configurations', async () => {
    vi.stubEnv('VITE_TPW_API_KEY', 'test-key');
    const module = await import('../tpwWidget.js');

    expect(module.getWidgetConfig('booking')).toMatchObject({
      id: 'mr-dj-booking-widget',
      type: 'booking',
    });

    expect(module.getWidgetConfig('calendar')).toMatchObject({
      id: 'mr-dj-calendar-widget',
      type: 'calendar',
    });

    expect(module.getWidgetConfig('reviews')).toMatchObject({
      id: 'mr-dj-reviews-widget',
      type: 'reviews',
    });

    expect(module.getWidgetConfig('unknown')).toMatchObject({
      id: 'mr-dj-booking-widget',
      type: 'booking',
    });
  });

  it('injects the TPW widget script and initializes the widget', async () => {
    vi.stubEnv('VITE_TPW_API_KEY', 'widget-key');
    const module = await import('../tpwWidget.js');

    const appendSpy = vi.spyOn(document.head, 'appendChild');

    const loadPromise = module.loadTPWWidget('widget-123');

    expect(appendSpy).toHaveBeenCalledTimes(1);
    const [scriptEl] = appendSpy.mock.calls[0];
    expect(scriptEl).toBeInstanceOf(HTMLScriptElement);
    expect(scriptEl.id).toBe('tpw-widget-script');

    // Simulate script load
    scriptEl.onload?.();

    await expect(loadPromise).resolves.toBeUndefined();
    expect(window.TPWWidget.init).toHaveBeenCalledWith({
      widgetId: 'widget-123',
      apiKey: 'widget-key',
    });
  });

  it('enforces API key requirement before initialization', async () => {
    vi.stubEnv('VITE_TPW_API_KEY', '');
    const module = await import('../tpwWidget.js');

    await expect(module.initializeWidget('container-id', 'booking')).rejects.toThrow(API_ERROR);
    expect(window.TPWWidget.render).not.toHaveBeenCalled();
  });

  it('loads, renders, and destroys the widget for a valid container', async () => {
    vi.stubEnv('VITE_TPW_API_KEY', 'valid-key');
    const module = await import('../tpwWidget.js');
    const loadSpy = vi.spyOn(module, 'loadTPWWidget').mockResolvedValue();

    const container = document.createElement('div');
    container.id = 'calendar-container';
    document.body.appendChild(container);

    await module.initializeWidget('calendar-container', 'calendar');

    expect(loadSpy).toHaveBeenCalledWith('mr-dj-calendar-widget');
    expect(window.TPWWidget.render).toHaveBeenCalledWith(
      'calendar-container',
      module.getWidgetConfig('calendar'),
    );

    module.destroyWidget('calendar-container');
    expect(window.TPWWidget.destroy).toHaveBeenCalledWith('calendar-container');
  });
});
