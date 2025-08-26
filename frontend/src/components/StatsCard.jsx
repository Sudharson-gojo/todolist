import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, count, icon, color, description, progress }) => {

  return (
    <div className={`stats-card stats-${color}`}>
      <div className="stats-content">
        <div className="stats-info">
          <p className="stats-title">{title}</p>
          <p className="stats-count">{count}</p>
          {description && (
            <p className="stats-description">{description}</p>
          )}
          {typeof progress === 'number' && (
            <div className="stats-progress">
              <div
                className={`stats-progress-bar stats-progress-${color}`}
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                aria-valuenow={Math.max(0, Math.min(100, progress))}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              />
            </div>
          )}
        </div>
        <div className="stats-icon">
          <span>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
