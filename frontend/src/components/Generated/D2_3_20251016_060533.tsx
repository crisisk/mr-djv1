// components/BeforeAfterSlider.jsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './BeforeAfterSlider.module.css';

const BeforeAfterSlider = ({ beforeImage, afterImage, alt }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef(null);

  const clampPosition = useCallback((value) => Math.min(Math.max(0, value), 100), []);

  const handleMove = useCallback((e) => {
    if (!isResizing) return;

    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = (x / rect.width) * 100;

    setSliderPosition(clampPosition(position));
  }, [clampPosition, isResizing]);

  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = useCallback(() => setIsResizing(false), []);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const delta = event.key === 'ArrowLeft' ? -5 : 5;
      setSliderPosition((current) => clampPosition(current + delta));
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMove);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMove);
    };
  }, [handleMove, handleMouseUp]);

  return (
    <div
      className={styles.container}
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onKeyDown={handleKeyDown}
      role="slider"
      tabIndex={0}
      aria-label="Before and after comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
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
