const express = require('express');
const { body } = require('express-validator');
const { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  getGamificationStats, 
  getLeaderboard 
} = require('../controllers/todoController');
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

// Task routes
router.post('/', protect, taskValidation, createTask);
router.get('/', protect, getTasks);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

// Gamification routes
router.get('/gamification/stats', protect, getGamificationStats);
router.get('/gamification/leaderboard', protect, getLeaderboard);

module.exports = router;
