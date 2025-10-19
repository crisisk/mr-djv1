// src/components/ParallaxSection.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ParallaxContainer = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  
  @media (max-width: 768px) {
    // Disable parallax on mobile for better performance
    background-attachment: scroll;
  }
`;

const ParallaxContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 2;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const ParallaxSection = ({ backgroundImage, children }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setOffset(window.pageYOffset);
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ParallaxContainer
      style={{
        backgroundImage: `url(${backgroundImage})`,
        transform: `translateY(${offset * 0.5}px)`
      }}
    >
      <Overlay />
      <ParallaxContent>
        {children}
      </ParallaxContent>
    </ParallaxContainer>
  );
};

export default ParallaxSection;
