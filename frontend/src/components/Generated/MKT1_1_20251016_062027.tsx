// components/GoogleReviews.jsx
import React, { useEffect, useState } from 'react';

const GoogleReviews = () => {
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    // Fetch reviews from Google Business API
    const fetchReviews = async () => {
      try {
        // Implementation would use actual Google Business API
        const response = await fetch('/api/google-reviews');
        const payload = await response.json();
        if (payload?.success) {
          const normalized = Array.isArray(payload?.data?.reviews)
            ? payload.data.reviews
            : payload.data;
          setReviews(Array.isArray(normalized) ? normalized : []);
        } else {
          setReviews(Array.isArray(payload) ? payload : []);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    
    fetchReviews();
  }, []);

  return (
    <section className="google-reviews">
      <h2>What Our Clients Say</h2>
      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="reviewer-info">
              <img src={review.profile_photo_url} alt={review.author_name} />
              <h3>{review.author_name}</h3>
            </div>
            <div className="rating">
              {/* Star rating implementation */}
              {Array(5).fill().map((_, i) => (
                <span key={i} className={i < review.rating ? 'star-filled' : 'star-empty'}>
                  ★
                </span>
              ))}
            </div>
            <p>{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GoogleReviews;
