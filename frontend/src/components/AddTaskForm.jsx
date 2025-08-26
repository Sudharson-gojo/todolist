import React, { useState } from 'react';
import './AddTaskForm.css';

const AddTaskForm = ({ onAddTask, defaultCategory = 'daily' }) => {
  const [newTask, setNewTask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddTask(newTask.trim(), defaultCategory);
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-task-form">
      <h3 className="form-title">Add New Task</h3>
      
      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-row">
          {/* Task Input */}
          <div className="form-group">
            <label htmlFor="task-input" className="form-label">
              Task Description
            </label>
            <input
              id="task-input"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="form-input"
              maxLength={200}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={!newTask.trim() || isSubmitting}
            className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
          >
            <span className="submit-icon">➕</span>
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;
