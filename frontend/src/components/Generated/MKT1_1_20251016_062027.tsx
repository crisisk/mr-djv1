// components/GoogleReviews.jsx
import { useEffect, useState } from 'react';
import GeneratedLayout from './GeneratedLayout';
import { apiClient } from '../../lib/apiClient';

interface GoogleReview {
  id: string | number;
  profile_photo_url?: string;
  author_name?: string;
  rating?: number;
  text?: string;
}

const GoogleReviews = () => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  
  useEffect(() => {
    // Fetch reviews from Google Business API
    const fetchReviews = async () => {
      try {
        // Implementation would use actual Google Business API
        const data = await apiClient.get<GoogleReview[]>('/api/google-reviews');
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <GeneratedLayout>
      <section className="google-reviews">
        <h2>What Our Clients Say</h2>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="reviewer-info">
                {review.profile_photo_url ? (
                  <img src={review.profile_photo_url} alt={review.author_name} />
                ) : null}
                <h3>{review.author_name}</h3>
              </div>
              <div className="rating">
                {/* Star rating implementation */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={i < (review.rating ?? 0) ? 'star-filled' : 'star-empty'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p>{review.text}</p>
            </div>
          ))}
        </div>
      </section>
    </GeneratedLayout>
  );
};

export default GoogleReviews;
