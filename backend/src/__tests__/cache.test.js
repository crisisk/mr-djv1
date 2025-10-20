const cache = require('../lib/cache');

describe('in-memory cache helper', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    cache.clear();
  });

  afterEach(() => {
    cache.clear();
    jest.useRealTimers();
  });

  it('stores and retrieves values with default TTL', () => {
    cache.set('foo', 'bar');

    jest.advanceTimersByTime(500);
    expect(cache.get('foo')).toBe('bar');
  });

  it('evicts values once the TTL expires', () => {
    cache.set('temp', 'value', 500);

    jest.advanceTimersByTime(400);
    expect(cache.get('temp')).toBe('value');

    jest.advanceTimersByTime(200);
    expect(cache.get('temp')).toBeUndefined();
  });

  it('supports explicit deletion and clearing', () => {
    cache.set('one', 1, 0);
    cache.set('two', 2);

    cache.del('one');
    expect(cache.get('one')).toBeUndefined();

    cache.clear();
    expect(cache.get('two')).toBeUndefined();
  });

  it('wraps factories with remember to prevent duplicate work', async () => {
    const factory = jest.fn().mockResolvedValue('computed');

    const first = await cache.remember('remembered', 250, factory);
    const second = await cache.remember('remembered', 250, factory);

    expect(first).toEqual({ value: 'computed', fresh: true });
    expect(second).toEqual({ value: 'computed', fresh: false });
    expect(factory).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(300);

    const third = await cache.remember('remembered', 250, factory);
    expect(third).toEqual({ value: 'computed', fresh: true });
    expect(factory).toHaveBeenCalledTimes(2);
  });
});
