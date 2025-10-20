const cache = require('../lib/cache');

describe('in-memory cache helper', () => {
  beforeEach(async () => {
    await cache.clear();
  });

  afterEach(() => {
    cache.clear();
    jest.useRealTimers();
  });

  it('stores and retrieves values with default TTL', async () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_000);
    await cache.set('foo', 'bar');

    nowSpy.mockReturnValue(1_500);
    await expect(cache.get('foo')).resolves.toBe('bar');
  });

  it('evicts values once the TTL expires', async () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(10_000);
    await cache.set('temp', 'value', 500);

    nowSpy.mockReturnValue(10_400);
    await expect(cache.get('temp')).resolves.toBe('value');

    nowSpy.mockReturnValue(10_600);
    await expect(cache.get('temp')).resolves.toBeUndefined();
  });

  it('supports explicit deletion and clearing', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(0);
    await cache.set('one', 1, 0);
    await cache.set('two', 2);

    await cache.del('one');
    await expect(cache.get('one')).resolves.toBeUndefined();

    await cache.clear();
    await expect(cache.get('two')).resolves.toBeUndefined();
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
