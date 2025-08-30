const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema - defines the structure of user documents
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true, // Remove whitespace
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Each email must be unique
    lowercase: true, // Convert to lowercase
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  // Gamification fields
  gamification: {
    points: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    xp: {
      type: Number,
      default: 0
    },
    badges: [{
      name: String,
      description: String,
      icon: String,
      unlockedAt: {
        type: Date,
        default: Date.now
      }
    }],
    achievements: {
      earlyBirdCount: {
        type: Number,
        default: 0
      },
      consistencyStreak: {
        type: Number,
        default: 0
      },
      lastDailyCompletion: Date,
      weeklyChampionWeeks: {
        type: Number,
        default: 0
      },
      totalTasksCompleted: {
        type: Number,
        default: 0
      },
      perfectDays: {
        type: Number,
        default: 0
      }
    },
    streaks: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastCompletionDate: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash password with salt rounds of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user info without password
userSchema.methods.getUserInfo = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    createdAt: this.createdAt,
    gamification: this.gamification
  };
};

// Gamification methods
userSchema.methods.addPoints = function(points) {
  this.gamification.points += points;
  this.gamification.xp += points;
  this.checkLevelUp();
};

userSchema.methods.removePoints = function(points) {
  this.gamification.points = Math.max(0, this.gamification.points - points);
  // Don't remove XP, only points
};

userSchema.methods.checkLevelUp = function() {
  const xpForNextLevel = this.gamification.level * 100; // 100 XP per level
  if (this.gamification.xp >= xpForNextLevel) {
    this.gamification.level += 1;
    return true; // Level up occurred
  }
  return false;
};

userSchema.methods.addBadge = function(badgeData) {
  const existingBadge = this.gamification.badges.find(b => b.name === badgeData.name);
  if (!existingBadge) {
    this.gamification.badges.push(badgeData);
    return true; // New badge added
  }
  return false;
};

userSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastCompletion = this.gamification.streaks.lastCompletionDate;
  
  if (!lastCompletion) {
    // First completion
    this.gamification.streaks.current = 1;
    this.gamification.streaks.lastCompletionDate = today;
  } else {
    const lastCompletionDate = new Date(lastCompletion);
    lastCompletionDate.setHours(0, 0, 0, 0);
    
    const daysDiff = (today - lastCompletionDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff === 1) {
      // Consecutive day
      this.gamification.streaks.current += 1;
      this.gamification.streaks.lastCompletionDate = today;
    } else if (daysDiff > 1) {
      // Streak broken
      this.gamification.streaks.current = 1;
      this.gamification.streaks.lastCompletionDate = today;
    }
    // If daysDiff === 0, same day completion, don't change streak
  }
  
  // Update longest streak
  if (this.gamification.streaks.current > this.gamification.streaks.longest) {
    this.gamification.streaks.longest = this.gamification.streaks.current;
  }
};

module.exports = mongoose.model('User', userSchema);
