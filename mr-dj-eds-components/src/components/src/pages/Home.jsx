// src/pages/Home.jsx
import React from 'react';
import ParallaxSection from '../components/ParallaxSection';

const Home = () => {
  return (
    <>
      <ParallaxSection backgroundImage="/images/dj-hero.jpg">
        <h1>Mr. DJ</h1>
        <p>Premium DJ Services for Your Special Events</p>
      </ParallaxSection>
      
      <ParallaxSection backgroundImage="/images/dj-equipment.jpg">
        <h2>Professional Equipment</h2>
        <p>State-of-the-art sound systems and lighting</p>
      </ParallaxSection>
      
      {/* Regular content sections in between */}
      
      <ParallaxSection backgroundImage="/images/dj-party.jpg">
        <h2>Create Unforgettable Moments</h2>
        <p>Book your event today</p>
      </ParallaxSection>
    </>
  );
};

export default Home;