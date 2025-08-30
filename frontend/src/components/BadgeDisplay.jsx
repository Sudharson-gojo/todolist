import React, { useState } from 'react';
import './BadgeDisplay.css';

const BadgeDisplay = ({ badges, newBadges = [], showAnimation = false }) => {
  const [showTooltip, setShowTooltip] = useState(null);

  const handleBadgeHover = (badgeId) => {
    setShowTooltip(badgeId);
  };

  const handleBadgeLeave = () => {
    setShowTooltip(null);
  };

  if (!badges || badges.length === 0) {
    return (
      <div className="badge-display-container">
        <div className="badge-header">
          <h3 className="badge-title">Badges</h3>
          <span className="badge-count">0</span>
        </div>
        <div className="no-badges">
          <div className="no-badges-icon">🏆</div>
          <p className="no-badges-text">Complete tasks to earn your first badge!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="badge-display-container">
      <div className="badge-header">
        <h3 className="badge-title">Badges</h3>
        <span className="badge-count">{badges.length}</span>
      </div>
      
      <div className="badges-grid">
        {badges.map((badge, index) => {
          const isNew = newBadges.some(newBadge => newBadge.name === badge.name);
          return (
            <div
              key={`${badge.name}-${index}`}
              className={`badge-item ${isNew && showAnimation ? 'new-badge-animation' : ''}`}
              onMouseEnter={() => handleBadgeHover(`${badge.name}-${index}`)}
              onMouseLeave={handleBadgeLeave}
            >
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-name">{badge.name}</div>
              
              {showTooltip === `${badge.name}-${index}` && (
                <div className="badge-tooltip">
                  <div className="tooltip-content">
                    <div className="tooltip-title">{badge.name}</div>
                    <div className="tooltip-description">{badge.description}</div>
                    <div className="tooltip-date">
                      Earned: {new Date(badge.unlockedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeDisplay;
