const express = require('express');
const { body } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation middleware for task creation
const taskValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Task title must be between 1 and 200 characters'),
  body('category')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Category must be daily, weekly, or monthly')
];

// @route   POST /api/tasks
// @desc    Create a new task for the logged-in user
// @access  Private
router.post('/', protect, taskValidation, async (req, res) => {
  try {
    const { title, category = 'daily' } = req.body; // Default to 'daily' if not provided

    // Create new task
    const task = await Task.create({
      title,
      category,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        task: task.getTaskInfo()
      }
    });

  } catch (error) {
    console.error('Create task error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating task'
    });
  }
});

// @route   GET /api/tasks
// @desc    Get all tasks for the logged-in user (with optional category filter)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { category } = req.query; // Get category from query params
    
    // Build query object
    const query = { user: req.user.id };
    
    // Add category filter if provided
    if (category && ['daily', 'weekly', 'monthly'].includes(category)) {
      query.category = category;
    }

    // Find tasks for the current user (with optional category filter)
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: {
        tasks: tasks.map(task => task.getTaskInfo())
      }
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task (toggle completed status)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Find task and ensure it belongs to the user
    const task = await Task.findOne({ _id: id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Toggle the completed status
    task.completed = !task.completed;
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: {
        task: task.getTaskInfo()
      }
    });

  } catch (error) {
    console.error('Update task error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating task'
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task by ID (only if it belongs to the user)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Find task and ensure it belongs to the user
    const task = await Task.findOne({ _id: id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Delete the task
    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting task'
    });
  }
});

module.exports = router;
