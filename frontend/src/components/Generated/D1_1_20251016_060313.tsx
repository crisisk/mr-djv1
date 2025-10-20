// components/Hero.jsx
import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <div className={styles.heroContainer}>
      {/* Video Background */}
      <div className={styles.videoWrapper}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className={styles.videoBackground}
          poster="/images/events/hero-feest-dj.webp"
        >
          <source src="/videos/dj-performance.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={styles.overlay}></div>
      </div>

      {/* Hero Content */}
      <div className={styles.heroContent}>
        <h1>Premium DJ Services</h1>
        <p>Creating unforgettable moments through music</p>
        <button className={styles.cta}>Book Now</button>
      </div>
    </div>
  );
};

export default Hero;
