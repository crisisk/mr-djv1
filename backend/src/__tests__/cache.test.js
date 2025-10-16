const cache = require('../lib/cache');

describe('in-memory cache helper', () => {
  beforeEach(() => {
    cache.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('stores and retrieves values with default TTL', () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_000);
    cache.set('foo', 'bar');

    nowSpy.mockReturnValue(1_500);
    expect(cache.get('foo')).toBe('bar');
  });

  it('evicts values once the TTL expires', () => {
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(10_000);
    cache.set('temp', 'value', 500);

    nowSpy.mockReturnValue(10_400);
    expect(cache.get('temp')).toBe('value');

    nowSpy.mockReturnValue(10_600);
    expect(cache.get('temp')).toBeUndefined();
  });

  it('supports explicit deletion and clearing', () => {
    jest.spyOn(Date, 'now').mockReturnValue(0);
    cache.set('one', 1, 0);
    cache.set('two', 2);

    cache.del('one');
    expect(cache.get('one')).toBeUndefined();

    cache.clear();
    expect(cache.get('two')).toBeUndefined();
  });
});
