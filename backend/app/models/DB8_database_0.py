// searchService.ts
import { Pool } from 'pg';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

/**
 * Search DJ profiles using full-text search
 * @param query - The search query string
 * @returns Array of matching DJ profiles
 */
export async function searchDJProfiles(query: string): Promise<any[]> {
  if (!query) {
    throw new Error('Search query cannot be empty');
  }

  const searchQuery = `
    SELECT id, name, bio, genres
    FROM dj_profiles
    WHERE search_vector @@ to_tsquery('english', $1)
    ORDER BY ts_rank(search_vector, to_tsquery('english', $1)) DESC;
  `;

  try {
    const { rows } = await pool.query(searchQuery, [query.split(' ').join(' & ')]);
    return rows;
  } catch (error) {
    console.error('Error executing search query:', error);
    throw new Error('Failed to execute search query');
  }
}

// Example usage
(async () => {
  try {
    const results = await searchDJProfiles('techno house');
    console.log('Search Results:', results);
  } catch (error) {
    console.error('Error:', error);
  }
})();
