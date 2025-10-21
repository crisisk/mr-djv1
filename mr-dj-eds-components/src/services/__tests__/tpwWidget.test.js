import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const setupWindowWidget = () => {
  global.window.TPWWidget = {
    init: vi.fn(),
    render: vi.fn(),
    destroy: vi.fn(),
  };
};

describe('tpwWidget service', () => {
  beforeEach(() => {
    vi.resetModules();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    setupWindowWidget();
  });

  afterEach(() => {
    delete process.env.VITE_TPW_API_KEY;
    vi.restoreAllMocks();
  });

  it('returns booking config by default and falls back for unknown types', async () => {
    const module = await import('../tpwWidget.js');
    const { getWidgetConfig } = module;

    const bookingConfig = getWidgetConfig();
    expect(bookingConfig).toMatchObject({
      id: 'mr-dj-booking-widget',
      type: 'booking',
    });

    const calendarConfig = getWidgetConfig('calendar');
    expect(calendarConfig).toMatchObject({
      id: 'mr-dj-calendar-widget',
      type: 'calendar',
    });

    const fallbackConfig = getWidgetConfig('non-existent');
    expect(fallbackConfig).toEqual(bookingConfig);
  });

  it('loads TPW script once and initializes with API key', async () => {
    process.env.VITE_TPW_API_KEY = 'test-api-key';
    const module = await import('../tpwWidget.js');
    const { loadTPWWidget } = module;

    const originalAppendChild = document.head.appendChild.bind(document.head);
    const appendSpy = vi
      .spyOn(document.head, 'appendChild')
      .mockImplementation((element) => {
        const result = originalAppendChild(element);
        element.onload?.();
        return result;
      });

    await loadTPWWidget('widget-123');

    const script = document.getElementById('tpw-widget-script');
    expect(script).toBeTruthy();
    expect(script.tagName).toBe('SCRIPT');
    expect(script.getAttribute('src')).toContain('https://widgets.tpw.com/embed.js');

    expect(window.TPWWidget.init).toHaveBeenCalledWith({
      widgetId: 'widget-123',
      apiKey: 'test-api-key',
    });

    expect(appendSpy).toHaveBeenCalledTimes(1);

    // Call again should resolve immediately without creating new script
    await loadTPWWidget('widget-123');
    expect(appendSpy).toHaveBeenCalledTimes(1);
  });

  it('throws a descriptive error when API key is missing during initialization', async () => {
    process.env.VITE_TPW_API_KEY = '';
    const module = await import('../tpwWidget.js');

    await expect(module.initializeWidget('missing-container')).rejects.toThrow(
      'TPW API key ontbreekt. Stel VITE_TPW_API_KEY in om de TPW widget te laden.'
    );
  });

  it('initializes widget and renders into the requested container', async () => {
    process.env.VITE_TPW_API_KEY = 'active-api-key';
    const module = await import('../tpwWidget.js');
    const { initializeWidget, getWidgetConfig } = module;

    const loadSpy = vi.spyOn(module, 'loadTPWWidget').mockResolvedValue();

    const container = document.createElement('div');
    container.id = 'tpw-container';
    document.body.appendChild(container);

    await initializeWidget('tpw-container', 'reviews');

    const expectedConfig = getWidgetConfig('reviews');

    expect(loadSpy).toHaveBeenCalledWith(expectedConfig.id);
    expect(window.TPWWidget.render).toHaveBeenCalledWith('tpw-container', expectedConfig);
  });

  it('throws when the container cannot be found during initialization', async () => {
    process.env.VITE_TPW_API_KEY = 'active-api-key';
    const module = await import('../tpwWidget.js');
    vi.spyOn(module, 'loadTPWWidget').mockResolvedValue();

    await expect(module.initializeWidget('unknown-container')).rejects.toThrow(
      'Container unknown-container not found'
    );
  });

  it('destroys the widget when destroyWidget is called', async () => {
    const module = await import('../tpwWidget.js');
    const { destroyWidget } = module;

    destroyWidget('tpw-container');

    expect(window.TPWWidget.destroy).toHaveBeenCalledWith('tpw-container');
  });

  it('safely skips destruction when TPWWidget is unavailable', async () => {
    const module = await import('../tpwWidget.js');
    const { destroyWidget } = module;
    const originalWidget = window.TPWWidget;

    delete window.TPWWidget;

    expect(() => destroyWidget('tpw-container')).not.toThrow();

    window.TPWWidget = originalWidget;
  });
});
