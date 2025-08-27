import React, { useState } from 'react';
import './AddTaskForm.css';

const AddTaskForm = ({ onAddTask, defaultCategory = 'daily' }) => {
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddTask(newTask.trim(), category);
      setNewTask('');
      setCategory(defaultCategory);
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
            <label htmlFor="task-input" className="form-label yellow-label">
              Task Description
            </label>
            <input
              id="task-input"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="form-input dark-input"
              maxLength={200}
              disabled={isSubmitting}
            />
          </div>
          {/* Category Select */}
          <div className="form-group">
            <label htmlFor="category-select" className="form-label yellow-label">
              Category
            </label>
            <select
              id="category-select"
              className="form-select light-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={!newTask.trim() || isSubmitting}
            className={`submit-btn light-btn ${isSubmitting ? 'loading' : ''}`}
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
