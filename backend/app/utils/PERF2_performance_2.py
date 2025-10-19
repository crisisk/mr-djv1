// src/components/common/LoadingSpinner.tsx
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner-circle"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
