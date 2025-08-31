const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory store (replace with DB later)
let users = new Map();
let tasks = new Map();

// Initialize with seed data
const initializeData = () => {
  const sudharsonId = 'user-1';
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  // Create user
  users.set(sudharsonId, {
    id: sudharsonId,
    name: 'Sudharson',
    email: 'sudharson@example.com',
    progress: {
      userId: sudharsonId,
      points: 150,
      level: 2,
      xp: 75,
      badges: [],
      streaks: { daily: 3, bestDaily: 5 },
      progress: { dailyPct: 60, weeklyPct: 40, monthlyPct: 25, overallPct: 45 }
    }
  });

  // Create sample tasks
  const sampleTasks = [
    { id: 'task-1', userId: sudharsonId, title: 'Morning workout', frequency: 'daily', assignedFor: today },
    { id: 'task-2', userId: sudharsonId, title: 'Read 30 minutes', frequency: 'daily', assignedFor: today, completedAt: new Date().toISOString() },
    { id: 'task-3', userId: sudharsonId, title: 'Weekly planning', frequency: 'weekly', assignedFor: getWeekStart(now) },
    { id: 'task-4', userId: sudharsonId, title: 'Monthly review', frequency: 'monthly', assignedFor: getMonthStart(now) }
  ];

  sampleTasks.forEach(task => {
    task.createdAt = new Date().toISOString();
    tasks.set(task.id, task);
  });
};

// Utility functions
const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff)).toISOString().split('T')[0];
};

const getMonthStart = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
};

const calculateRequiredXP = (level) => {
  return 100 + (level - 1) * 50;
};

const getLevelName = (level) => {
  const names = {
    1: 'Novice',
    2: 'Doer', 
    3: 'Task Master',
    4: 'Focus Pro',
    5: 'Zen Operator',
    6: 'Productivity Guru',
    7: 'Efficiency Expert',
    8: 'Master Organizer'
  };
  return names[level] || `Level ${level} Master`;
};

const calculatePoints = (task, completedAt) => {
  const now = new Date(completedAt);
  const assigned = new Date(task.assignedFor);
  
  let points = 0;
  let deadline;
  
  switch (task.frequency) {
    case 'daily':
      deadline = new Date(assigned);
      deadline.setDate(deadline.getDate() + 1);
      points = now <= deadline ? 10 : -5;
      break;
    case 'weekly':
      deadline = new Date(assigned);
      deadline.setDate(deadline.getDate() + 7);
      points = now <= deadline ? 25 : -10;
      break;
    case 'monthly':
      deadline = new Date(assigned);
      deadline.setMonth(deadline.getMonth() + 1);
      points = now <= deadline ? 60 : -20;
      break;
  }
  
  // Early bird bonus (5:00-9:00 AM)
  const hour = now.getHours();
  if (hour >= 5 && hour < 9 && points > 0) {
    points += 5;
  }
  
  return points;
};

const checkBadges = (user, tasks) => {
  const newBadges = [];
  const userTasks = Array.from(tasks.values()).filter(t => t.userId === user.id);
  
  // Early Bird badge
  const hasEarlyBird = user.progress.badges.some(b => b.id === 'earlyBird');
  if (!hasEarlyBird) {
    const earlyCompletions = userTasks.filter(t => {
      if (!t.completedAt) return false;
      const hour = new Date(t.completedAt).getHours();
      return hour >= 5 && hour < 9;
    });
    
    if (earlyCompletions.length > 0) {
      newBadges.push({
        id: 'earlyBird',
        name: 'Early Bird',
        description: 'Complete a task between 5:00-9:00 AM',
        earnedAt: new Date().toISOString()
      });
    }
  }
  
  // Consistency King badge (7 consecutive days)
  const hasConsistency = user.progress.badges.some(b => b.id === 'consistencyKing');
  if (!hasConsistency && user.progress.streaks.daily >= 7) {
    newBadges.push({
      id: 'consistencyKing',
      name: 'Consistency King',
      description: 'Complete all daily tasks for 7 consecutive days',
      earnedAt: new Date().toISOString()
    });
  }
  
  // Weekly Champion badge
  const hasWeeklyChamp = user.progress.badges.some(b => b.id === 'weeklyChampion');
  if (!hasWeeklyChamp) {
    const thisWeek = getWeekStart(new Date());
    const weeklyTasks = userTasks.filter(t => 
      t.frequency === 'weekly' && t.assignedFor === thisWeek
    );
    const completedWeekly = weeklyTasks.filter(t => t.completedAt);
    
    if (weeklyTasks.length > 0 && completedWeekly.length === weeklyTasks.length) {
      newBadges.push({
        id: 'weeklyChampion',
        name: 'Weekly Champion',
        description: 'Complete all weekly tasks within the week',
        earnedAt: new Date().toISOString()
      });
    }
  }
  
  return newBadges;
};

const updateProgress = (userId) => {
  const user = users.get(userId);
  const userTasks = Array.from(tasks.values()).filter(t => t.userId === userId);
  
  const today = new Date().toISOString().split('T')[0];
  const thisWeek = getWeekStart(new Date());
  const thisMonth = getMonthStart(new Date());
  
  // Calculate progress percentages
  const dailyTasks = userTasks.filter(t => t.frequency === 'daily' && t.assignedFor === today);
  const weeklyTasks = userTasks.filter(t => t.frequency === 'weekly' && t.assignedFor === thisWeek);
  const monthlyTasks = userTasks.filter(t => t.frequency === 'monthly' && t.assignedFor === thisMonth);
  
  const dailyCompleted = dailyTasks.filter(t => t.completedAt).length;
  const weeklyCompleted = weeklyTasks.filter(t => t.completedAt).length;
  const monthlyCompleted = monthlyTasks.filter(t => t.completedAt).length;
  
  const dailyPct = dailyTasks.length > 0 ? Math.round((dailyCompleted / dailyTasks.length) * 100) : 0;
  const weeklyPct = weeklyTasks.length > 0 ? Math.round((weeklyCompleted / weeklyTasks.length) * 100) : 0;
  const monthlyPct = monthlyTasks.length > 0 ? Math.round((monthlyCompleted / monthlyTasks.length) * 100) : 0;
  
  const allTasks = [...dailyTasks, ...weeklyTasks, ...monthlyTasks];
  const allCompleted = allTasks.filter(t => t.completedAt).length;
  const overallPct = allTasks.length > 0 ? Math.round((allCompleted / allTasks.length) * 100) : 0;
  
  user.progress.progress = { dailyPct, weeklyPct, monthlyPct, overallPct };
  
  // Update streaks (simplified)
  if (dailyPct === 100) {
    user.progress.streaks.daily += 1;
    user.progress.streaks.bestDaily = Math.max(user.progress.streaks.daily, user.progress.streaks.bestDaily);
  } else if (dailyTasks.length > 0) {
    user.progress.streaks.daily = 0;
  }
};

// Routes
app.get('/api/me', (req, res) => {
  const userId = 'user-1'; // Simplified auth
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  updateProgress(userId);
  
  res.json({
    success: true,
    data: {
      user: {
        ...user,
        levelName: getLevelName(user.progress.level),
        nextLevelXP: calculateRequiredXP(user.progress.level + 1),
        currentLevelXP: calculateRequiredXP(user.progress.level)
      }
    }
  });
});

app.get('/api/tasks', (req, res) => {
  const userId = 'user-1';
  const { range = 'today' } = req.query;
  
  let filterDate;
  const now = new Date();
  
  switch (range) {
    case 'today':
      filterDate = now.toISOString().split('T')[0];
      break;
    case 'week':
      filterDate = getWeekStart(now);
      break;
    case 'month':
      filterDate = getMonthStart(now);
      break;
    default:
      filterDate = now.toISOString().split('T')[0];
  }
  
  const userTasks = Array.from(tasks.values()).filter(t => 
    t.userId === userId && t.assignedFor === filterDate
  );
  
  res.json({
    success: true,
    data: { tasks: userTasks }
  });
});

app.post('/api/tasks/:id/complete', (req, res) => {
  const { id } = req.params;
  const userId = 'user-1';
  
  const task = tasks.get(id);
  if (!task || task.userId !== userId) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const user = users.get(userId);
  const completedAt = new Date().toISOString();
  
  // Toggle completion
  if (task.completedAt) {
    task.completedAt = undefined;
  } else {
    task.completedAt = completedAt;
    
    // Calculate points and XP
    const pointsEarned = calculatePoints(task, completedAt);
    user.progress.points += pointsEarned;
    
    if (pointsEarned > 0) {
      user.progress.xp += pointsEarned;
    }
    
    // Check for level up
    let levelUp = false;
    const requiredXP = calculateRequiredXP(user.progress.level + 1);
    if (user.progress.xp >= requiredXP) {
      user.progress.level += 1;
      user.progress.xp -= requiredXP;
      levelUp = true;
    }
    
    // Check for new badges
    const newBadges = checkBadges(user, tasks);
    user.progress.badges.push(...newBadges);
    
    updateProgress(userId);
    
    return res.json({
      success: true,
      data: {
        task,
        progress: user.progress,
        levelUp,
        newBadges,
        pointsEarned
      }
    });
  }
  
  updateProgress(userId);
  
  res.json({
    success: true,
    data: {
      task,
      progress: user.progress,
      pointsEarned: 0
    }
  });
});

app.get('/api/calendar', (req, res) => {
  const userId = 'user-1';
  const { month } = req.query;
  
  const userTasks = Array.from(tasks.values()).filter(t => t.userId === userId);
  const calendar = [];
  
  // Generate calendar data for the month
  const startDate = new Date(month + '-01');
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const weekStart = getWeekStart(d);
    const monthStart = getMonthStart(d);
    
    const dailyTasks = userTasks.filter(t => t.frequency === 'daily' && t.assignedFor === dateStr);
    const weeklyTasks = userTasks.filter(t => t.frequency === 'weekly' && t.assignedFor === weekStart);
    const monthlyTasks = userTasks.filter(t => t.frequency === 'monthly' && t.assignedFor === monthStart);
    
    calendar.push({
      date: dateStr,
      assignments: {
        daily: dailyTasks.length > 0,
        weekly: weeklyTasks.length > 0,
        monthly: monthlyTasks.length > 0
      },
      completions: {
        daily: dailyTasks.every(t => t.completedAt),
        weekly: weeklyTasks.every(t => t.completedAt),
        monthly: monthlyTasks.every(t => t.completedAt)
      },
      isStreakDay: dailyTasks.length > 0 && dailyTasks.every(t => t.completedAt)
    });
  }
  
  res.json({
    success: true,
    data: { calendar }
  });
});

// Demo endpoints
app.post('/api/cron/rollover', (req, res) => {
  // Simulate deadline passes for demo
  res.json({ success: true, message: 'Rollover simulated' });
});

// Initialize data and start server
initializeData();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
