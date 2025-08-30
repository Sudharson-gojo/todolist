const Task = require('../models/Task');
const User = require('../models/userModel');
const GamificationService = require('../services/gamificationService');

// Get all tasks for a user (with optional category filter)
const getTasks = async (req, res) => {
  try {
    const { category } = req.query;
    const userId = req.user.id;

    // Build query
    const query = { user: userId };
    if (category) {
      query.category = category;
    }

    // Find tasks and sort by creation date (newest first)
    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        tasks: tasks.map(task => task.getTaskInfo()),
        count: tasks.length
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, category = 'daily' } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    // Create new task
    const task = new Task({
      title: title.trim(),
      category,
      user: userId
    });

    await task.save();

    res.status(201).json({
      success: true,
      data: {
        task: task.getTaskInfo()
      },
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Error creating task:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating task'
    });
  }
};

// Update task (toggle completion)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find task
    const task = await Task.findOne({ _id: id, user: userId });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Toggle completion status
    const wasCompleted = task.completed;
    
    if (!wasCompleted) {
      // Task is being completed - process gamification
      const gamificationResult = await GamificationService.processTaskCompletion(id, userId);
      
      res.status(200).json({
        success: true,
        data: {
          task: task.getTaskInfo(),
          gamification: gamificationResult
        },
        message: 'Task completed successfully'
      });
    } else {
      // Task is being uncompleted
      task.completed = false;
      task.completedAt = null;
      task.pointsAwarded = 0;
      
      // Remove points from user (if any were awarded)
      const user = await User.findById(userId);
      if (task.pointsAwarded > 0) {
        user.removePoints(task.pointsAwarded);
        await user.save();
      }
      
      await task.save();
      
      res.status(200).json({
        success: true,
        data: {
          task: task.getTaskInfo()
        },
        message: 'Task marked as incomplete'
      });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task'
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find and delete task
    const task = await Task.findOneAndDelete({ _id: id, user: userId });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task'
    });
  }
};

// Get user's gamification stats
const getGamificationStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await GamificationService.getUserStats(userId);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching gamification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats'
    });
  }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const leaderboard = await GamificationService.getLeaderboard(parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard'
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getGamificationStats,
  getLeaderboard
};