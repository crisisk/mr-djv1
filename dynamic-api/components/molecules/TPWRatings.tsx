'use client';

import { useEffect, useState } from 'react';

interface TPWRatingsData {
  widget_code?: string;
  rich_snippet_code?: string;
  rating_count: number;
  name: string;
  average_rating: number;
}

interface TPWRatingsProps {
  apiKey: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export function TPWRatings({ apiKey, variant = 'light', className = '' }: TPWRatingsProps) {
  const [ratingsData, setRatingsData] = useState<TPWRatingsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

        const data: TPWRatingsData = await response.json();
        setRatingsData(data);
      } catch (err) {
        console.error('Error fetching TPW ratings:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
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
        <div className="flex items-center justify-center p-spacing-md">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
            role="status"
            aria-label="Beoordelingen laden"
          >
            <span className="sr-only">Laden...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.warn('TPW Ratings widget error:', error);
    return null;
  }

  if (!ratingsData) {
    return null;
  }

  return (
    <div className={`widget_tpw_rating_wrap ${className}`}>
      {ratingsData.widget_code && (
        <div
          dangerouslySetInnerHTML={{ __html: ratingsData.widget_code }}
        />
      )}

      {ratingsData.rich_snippet_code && (
        <div
          dangerouslySetInnerHTML={{ __html: ratingsData.rich_snippet_code }}
        />
      )}

      {ratingsData.rating_count > 0 && (
        <p className="m-0 p-0 text-center text-primary">
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