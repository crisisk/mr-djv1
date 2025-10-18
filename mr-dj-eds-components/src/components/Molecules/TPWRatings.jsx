import { useEffect, useState } from 'react';

/**
 * TPW Ratings Widget Component
 * Displays reviews from ThePerfectWedding.nl with Google rich snippets
 *
 * @param {string} apiKey - The TPW widget API key
 * @param {string} variant - The widget variant ('light' or 'dark')
 * @param {string} className - Additional CSS classes
 */
export function TPWRatings({ apiKey, variant = 'light', className = '' }) {
  const [ratingsData, setRatingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = `https://weblapi.theperfectwedding.nl/companies/widget/${apiKey}?variant=${variant}`;

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRatingsData(data);
      } catch (err) {
        console.error('Error fetching TPW ratings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (apiKey) {
      fetchRatings();
    }
  }, [apiKey, variant]);

  if (loading) {
    return (
      <div className={`widget_tpw_rating_wrap ${className}`}>
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('TPW Ratings widget error:', error);
    return null; // Fail silently for better UX
  }

  if (!ratingsData) {
    return null;
  }

  return (
    <div className={`widget_tpw_rating_wrap ${className}`}>
      {/* Widget code - contains the visual rating widget */}
      {ratingsData.widget_code && (
        <div
          dangerouslySetInnerHTML={{ __html: ratingsData.widget_code }}
        />
      )}

      {/* Rich snippet code - for Google search results */}
      {ratingsData.rich_snippet_code && (
        <div
          dangerouslySetInnerHTML={{ __html: ratingsData.rich_snippet_code }}
        />
      )}

      {/* Rating information summary */}
      {ratingsData.rating_count > 0 && (
        <p className="m-0 p-0 text-center">
          <small>
            <span>{ratingsData.name}</span>
            {' '}
            <span>
              <span>{ratingsData.average_rating}</span>
              {' '}
              uit
              {' '}
              <span>{ratingsData.rating_count}</span>
              {' '}
              ervaringen
            </span>
          </small>
        </p>
      )}
    </div>
  );
}

export default TPWRatings;
