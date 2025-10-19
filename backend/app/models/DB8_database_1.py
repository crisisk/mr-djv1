// searchService.test.ts
import { searchDJProfiles } from './searchService';

jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mockPool) };
});

describe('searchDJProfiles', () => {
  it('should return matching DJ profiles', async () => {
    const mockRows = [
      { id: 1, name: 'DJ Techno', bio: 'House and Techno DJ', genres: 'techno, house' },
    ];
    const mockPool = new (require('pg').Pool)();
    mockPool.query.mockResolvedValue({ rows: mockRows });

    const results = await searchDJProfiles('techno');
    expect(results).toEqual(mockRows);
    expect(mockPool.query).toHaveBeenCalledWith(expect.any(String), ['techno']);
  });

  it('should throw an error for empty query', async () => {
    await expect(searchDJProfiles('')).rejects.toThrow('Search query cannot be empty');
  });

  it('should handle database errors', async () => {
    const mockPool = new (require('pg').Pool)();
    mockPool.query.mockRejectedValue(new Error('Database error'));

    await expect(searchDJProfiles('techno')).rejects.toThrow('Failed to execute search query');
  });
});
