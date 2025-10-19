// components/BeforeAfterSlider.jsx

import React, { useState, useRef, useEffect } from 'react';
import styles from './BeforeAfterSlider.module.css';

const BeforeAfterSlider = ({ beforeImage, afterImage, alt }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef(null);

  const handleMove = (e) => {
    if (!isResizing) return;
    
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;
    
    setSliderPosition(Math.min(Math.max(0, position), 100));
  };

  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMove);
    };
  }, [isResizing]);

  return (
    <div 
      className={styles.container} 
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      <div className={styles.beforeImage}>
        <img src={beforeImage} alt={`${alt} - Before`} />
      </div>
      <div 
        className={styles.afterImage} 
        style={{ width: `${sliderPosition}%` }}
      >
        <img src={afterImage} alt={`${alt} - After`} />
      </div>
      <div 
        className={styles.slider}
        style={{ left: `${sliderPosition}%` }}
      >
        <div className={styles.handle} />
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
