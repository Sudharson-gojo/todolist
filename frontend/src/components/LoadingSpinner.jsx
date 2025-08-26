import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
