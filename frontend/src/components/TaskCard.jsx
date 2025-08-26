import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onToggle, onDelete, category }) => {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'daily': return 'category-daily';
      case 'weekly': return 'category-weekly';
      case 'monthly': return 'category-monthly';
      default: return 'category-default';
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'daily': return '📅';
      case 'weekly': return '📆';
      case 'monthly': return '🗓️';
      default: return '📝';
    }
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-main">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(task.id, category)}
            className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          >
            {task.completed && <span className="checkmark">✓</span>}
          </button>

          {/* Task Content */}
          <div className="task-details">
            <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
              {task.title}
            </h3>
            
            {/* Category Badge */}
            <div className="task-meta">
              <span className={`category-badge ${getCategoryColor(category)}`}>
                <span className="category-icon">{getCategoryIcon(category)}</span>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
              
              {/* Created Date */}
              <span className="task-date">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(task.id, category)}
          className="delete-btn"
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
