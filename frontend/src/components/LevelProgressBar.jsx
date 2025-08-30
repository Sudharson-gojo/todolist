import React from 'react';
import './LevelProgressBar.css';

const LevelProgressBar = ({ 
  level, 
  levelTitle, 
  xpProgress, 
  xpForNextLevel, 
  points,
  showAnimation = false 
}) => {
  const progressPercentage = Math.min((xpProgress / xpForNextLevel) * 100, 100);

  return (
    <div className={`level-progress-container ${showAnimation ? 'level-up-animation' : ''}`}>
      <div className="level-info">
        <div className="level-badge">
          <span className="level-number">Lv.{level}</span>
        </div>
        <div className="level-details">
          <div className="level-title">{levelTitle}</div>
          <div className="points-display">{points.toLocaleString()} pts</div>
        </div>
      </div>
      
      <div className="xp-progress">
        <div className="xp-bar-container">
          <div className="xp-bar-track">
            <div 
              className="xp-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            />
            <div className="xp-bar-glow" />
          </div>
        </div>
        <div className="xp-text">
          {xpProgress} / {xpForNextLevel} XP
        </div>
      </div>
    </div>
  );
};

export default LevelProgressBar;
