// components/AnimatedCounter.jsx
import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const AnimatedCounter = ({ end, duration = 2000, suffix = '', label = '' }) => {
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
    <div ref={ref} className="text-center">
      <div className="text-5xl font-bold text-primary mb-2">
        {count}{suffix}
      </div>
      {label && <div className="text-lg text-gray-600">{label}</div>}
    </div>
  );
};

export default AnimatedCounter;