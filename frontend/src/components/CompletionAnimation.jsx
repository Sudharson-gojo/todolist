import React, { useEffect, useState } from 'react';
import './CompletionAnimation.css';

const CompletionAnimation = ({ 
  show, 
  type = 'task', // 'task', 'badge', 'levelup'
  message = '',
  onComplete 
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onComplete) {
          setTimeout(onComplete, 300); // Wait for fade out
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show && !visible) return null;

  const getAnimationContent = () => {
    switch (type) {
      case 'badge':
        return {
          icon: '🏆',
          title: 'New Badge Unlocked!',
          subtitle: message,
          className: 'badge-animation'
        };
      case 'levelup':
        return {
          icon: '⭐',
          title: 'Level Up!',
          subtitle: message,
          className: 'levelup-animation'
        };
      default:
        return {
          icon: '✨',
          title: 'Task Completed!',
          subtitle: message,
          className: 'task-animation'
        };
    }
  };

  const content = getAnimationContent();

  return (
    <div className={`completion-overlay ${visible ? 'show' : 'hide'}`}>
      <div className={`completion-animation ${content.className}`}>
        <div className="completion-icon">{content.icon}</div>
        <div className="completion-title">{content.title}</div>
        {content.subtitle && (
          <div className="completion-subtitle">{content.subtitle}</div>
        )}
        <div className="completion-sparkles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`sparkle sparkle-${i + 1}`}>✨</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletionAnimation;
