import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const SocialMediaAd = ({ 
  videoUrl, 
  platform, 
  headline, 
  description, 
  ctaText 
}) => {
  // Track ad impressions
  useEffect(() => {
    const trackImpression = () => {
      // Add analytics tracking code here
      console.log(`Ad impression tracked for ${platform}`);
    };
    
    trackImpression();
  }, [platform]);

  return (
    <div className="social-media-ad">
      <div className="video-container">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="ad-video"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="ad-content">
        <h2 className="ad-headline">{headline}</h2>
        <p className="ad-description">{description}</p>
        <button className="ad-cta">{ctaText}</button>
      </div>
    </div>
  );
};

SocialMediaAd.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  platform: PropTypes.oneOf(['facebook', 'instagram']).isRequired,
  headline: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired
};

export default SocialMediaAd;
