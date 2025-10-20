// components/AnimatedCounter.jsx
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (inView) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, inView]);

  return (
    <div ref={ref} className="counter-item">
      <span className="counter-number">{count}</span>
      <span className="counter-suffix">{suffix}</span>
    </div>
  );
};

// Usage component
const StatsSection = () => {
  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stat-item">
          <AnimatedCounter end={500} suffix="+" />
          <p>events</p>
        </div>
        <div className="stat-item">
          <AnimatedCounter end={15} suffix="+" />
          <p>jaar ervaring</p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
