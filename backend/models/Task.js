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
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Task', taskSchema);
