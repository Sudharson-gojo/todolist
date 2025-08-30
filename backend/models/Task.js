const mongoose = require('mongoose');

// Task Schema - defines the structure of task documents
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true, // Remove whitespace
    maxlength: [200, 'Task title cannot be more than 200 characters']
  },
  completed: {
    type: Boolean,
    default: false // Tasks start as incomplete
  },
  category: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'], // Only allow these values
    default: 'daily', // Default category
    required: [true, 'Task category is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: [true, 'User is required']
  },
  // Gamification fields
  completedAt: {
    type: Date
  },
  deadline: {
    type: Date
  },
  pointsAwarded: {
    type: Number,
    default: 0
  },
  isOverdue: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set deadline based on category when task is created
  if (this.isNew && !this.deadline) {
    const now = new Date();
    switch (this.category) {
      case 'daily':
        this.deadline = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'weekly':
        const daysUntilSunday = 7 - now.getDay();
        this.deadline = new Date(now.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);
        this.deadline.setHours(23, 59, 59);
        break;
      case 'monthly':
        this.deadline = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
    }
  }
  
  // Check if task is overdue
  if (!this.completed && this.deadline && new Date() > this.deadline) {
    this.isOverdue = true;
  }
  
  next();
});

// Method to get task info without sensitive data
taskSchema.methods.getTaskInfo = function() {
  return {
    id: this._id,
    title: this.title,
    completed: this.completed,
    category: this.category,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    completedAt: this.completedAt,
    deadline: this.deadline,
    pointsAwarded: this.pointsAwarded,
    isOverdue: this.isOverdue
  };
};

// Method to calculate points for task completion
taskSchema.methods.calculatePoints = function() {
  if (this.completed && !this.pointsAwarded) {
    let basePoints = 0;
    
    // Base points by category
    switch (this.category) {
      case 'daily':
        basePoints = 10;
        break;
      case 'weekly':
        basePoints = 50;
        break;
      case 'monthly':
        basePoints = 200;
        break;
    }
    
    // Bonus for completing before deadline
    if (this.completedAt && this.deadline && this.completedAt <= this.deadline) {
      basePoints *= 1.5; // 50% bonus for on-time completion
    }
    
    // Early bird bonus (completed before 10 AM)
    if (this.completedAt && this.completedAt.getHours() < 10) {
      basePoints *= 1.2; // 20% early bird bonus
    }
    
    return Math.round(basePoints);
  }
  
  return 0;
};

module.exports = mongoose.model('Task', taskSchema);
