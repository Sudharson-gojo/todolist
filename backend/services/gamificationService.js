const User = require('../models/userModel');
const Task = require('../models/Task');

class GamificationService {
  // Badge definitions
  static BADGES = {
    EARLY_BIRD: {
      name: 'Early Bird',
      description: 'Complete a task before 10 AM',
      icon: '🌅',
      requirement: 1
    },
    CONSISTENCY_KING: {
      name: 'Consistency King',
      description: 'Complete daily tasks for 7 days in a row',
      icon: '👑',
      requirement: 7
    },
    WEEKLY_CHAMPION: {
      name: 'Weekly Champion',
      description: 'Complete all weekly tasks in a week',
      icon: '🏆',
      requirement: 1
    },
    TASK_MASTER: {
      name: 'Task Master',
      description: 'Complete 100 tasks',
      icon: '🎯',
      requirement: 100
    },
    PERFECT_WEEK: {
      name: 'Perfect Week',
      description: 'Complete all tasks for a full week',
      icon: '⭐',
      requirement: 1
    },
    SPEED_DEMON: {
      name: 'Speed Demon',
      description: 'Complete 10 tasks in one day',
      icon: '⚡',
      requirement: 10
    }
  };

  // Level titles based on level number
  static getLevelTitle(level) {
    const titles = {
      1: 'Beginner',
      2: 'Novice',
      3: 'Task Master',
      4: 'Productivity Pro',
      5: 'Efficiency Expert',
      6: 'Goal Crusher',
      7: 'Achievement Hunter',
      8: 'Legendary Organizer',
      9: 'Productivity Guru',
      10: 'Task Overlord'
    };
    
    if (level >= 10) {
      return `Task Overlord Level ${level - 9}`;
    }
    
    return titles[level] || `Level ${level} Master`;
  }

  // Calculate XP needed for next level
  static getXPForNextLevel(currentLevel) {
    return currentLevel * 100;
  }

  // Process task completion and award points/badges
  static async processTaskCompletion(taskId, userId) {
    try {
      const task = await Task.findById(taskId);
      const user = await User.findById(userId);
      
      if (!task || !user) {
        throw new Error('Task or user not found');
      }

      // Mark task as completed
      task.completed = true;
      task.completedAt = new Date();
      
      // Calculate and award points
      const points = task.calculatePoints();
      task.pointsAwarded = points;
      
      // Update user points and XP
      const leveledUp = user.addPoints(points);
      user.gamification.achievements.totalTasksCompleted += 1;
      
      // Update streak
      user.updateStreak();
      
      // Check for badges
      const newBadges = await this.checkAndAwardBadges(user, task);
      
      // Save changes
      await task.save();
      await user.save();
      
      return {
        pointsAwarded: points,
        leveledUp,
        newLevel: user.gamification.level,
        newBadges,
        currentStreak: user.gamification.streaks.current,
        totalPoints: user.gamification.points
      };
      
    } catch (error) {
      console.error('Error processing task completion:', error);
      throw error;
    }
  }

  // Check and award badges based on achievements
  static async checkAndAwardBadges(user, completedTask) {
    const newBadges = [];
    
    // Early Bird badge
    if (completedTask.completedAt && completedTask.completedAt.getHours() < 10) {
      user.gamification.achievements.earlyBirdCount += 1;
      
      if (user.gamification.achievements.earlyBirdCount >= this.BADGES.EARLY_BIRD.requirement) {
        const badgeAdded = user.addBadge(this.BADGES.EARLY_BIRD);
        if (badgeAdded) newBadges.push(this.BADGES.EARLY_BIRD);
      }
    }
    
    // Consistency King badge (7-day streak)
    if (user.gamification.streaks.current >= this.BADGES.CONSISTENCY_KING.requirement) {
      const badgeAdded = user.addBadge(this.BADGES.CONSISTENCY_KING);
      if (badgeAdded) newBadges.push(this.BADGES.CONSISTENCY_KING);
    }
    
    // Task Master badge (100 tasks)
    if (user.gamification.achievements.totalTasksCompleted >= this.BADGES.TASK_MASTER.requirement) {
      const badgeAdded = user.addBadge(this.BADGES.TASK_MASTER);
      if (badgeAdded) newBadges.push(this.BADGES.TASK_MASTER);
    }
    
    // Weekly Champion badge
    if (completedTask.category === 'weekly') {
      const weeklyChampion = await this.checkWeeklyChampion(user._id);
      if (weeklyChampion) {
        user.gamification.achievements.weeklyChampionWeeks += 1;
        const badgeAdded = user.addBadge(this.BADGES.WEEKLY_CHAMPION);
        if (badgeAdded) newBadges.push(this.BADGES.WEEKLY_CHAMPION);
      }
    }
    
    return newBadges;
  }

  // Check if user completed all weekly tasks this week
  static async checkWeeklyChampion(userId) {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const weeklyTasks = await Task.find({
      user: userId,
      category: 'weekly',
      createdAt: { $gte: weekStart, $lte: weekEnd }
    });
    
    if (weeklyTasks.length === 0) return false;
    
    const completedWeeklyTasks = weeklyTasks.filter(task => task.completed);
    return completedWeeklyTasks.length === weeklyTasks.length;
  }

  // Process overdue tasks and deduct points
  static async processOverdueTasks() {
    try {
      const overdueTasks = await Task.find({
        completed: false,
        deadline: { $lt: new Date() },
        isOverdue: false
      }).populate('user');
      
      for (const task of overdueTasks) {
        task.isOverdue = true;
        
        // Deduct points based on category
        let pointsToDeduct = 0;
        switch (task.category) {
          case 'daily':
            pointsToDeduct = 5;
            break;
          case 'weekly':
            pointsToDeduct = 25;
            break;
          case 'monthly':
            pointsToDeduct = 100;
            break;
        }
        
        task.user.removePoints(pointsToDeduct);
        
        await task.save();
        await task.user.save();
      }
      
      return overdueTasks.length;
    } catch (error) {
      console.error('Error processing overdue tasks:', error);
      throw error;
    }
  }

  // Get user's gamification stats
  static async getUserStats(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      const currentLevel = user.gamification.level;
      const currentXP = user.gamification.xp;
      const xpForCurrentLevel = (currentLevel - 1) * 100;
      const xpForNextLevel = currentLevel * 100;
      const xpProgress = currentXP - xpForCurrentLevel;
      const xpNeeded = xpForNextLevel - currentXP;
      
      return {
        points: user.gamification.points,
        level: currentLevel,
        levelTitle: this.getLevelTitle(currentLevel),
        xp: currentXP,
        xpProgress,
        xpNeeded,
        xpForNextLevel: xpForNextLevel - xpForCurrentLevel,
        badges: user.gamification.badges,
        achievements: user.gamification.achievements,
        streaks: user.gamification.streaks
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Get leaderboard data
  static async getLeaderboard(limit = 10) {
    try {
      const users = await User.find({})
        .sort({ 'gamification.points': -1 })
        .limit(limit)
        .select('name gamification.points gamification.level gamification.badges');
      
      return users.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        points: user.gamification.points,
        level: user.gamification.level,
        levelTitle: this.getLevelTitle(user.gamification.level),
        badgeCount: user.gamification.badges.length
      }));
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }
}

module.exports = GamificationService;
