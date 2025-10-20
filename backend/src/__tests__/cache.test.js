const cache = require('../lib/cache');

describe('in-memory cache helper', () => {
  beforeEach(async () => {
    await cache.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
});
