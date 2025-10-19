import React from 'react';

const ImageComponent = () => {
  return (
    <div className="image-container">
      {/* Example image with WebP and lazy loading */}
      <picture>
        <source srcSet="/assets/images/dj-performance.webp" type="image/webp" />
        <source srcSet="/assets/images/dj-performance.jpg" type="image/jpeg" />
        <img
          src="/assets/images/dj-performance.jpg"
          alt="DJ performing at an event"
          loading="lazy"
          className="responsive-image"
        />
      </picture>
    </div>
  );
};

export default ImageComponent;
