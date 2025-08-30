import React, { useMemo } from 'react';
import './Dashboard.css';
import LevelProgressBar from './LevelProgressBar';
import BadgeDisplay from './BadgeDisplay';

const Dashboard = ({ tasks, gamificationData, onClose }) => {
  // Calculate progress for different time periods
  const progressData = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Helper function to check if task is in time period
    const isInPeriod = (task, startDate, endDate = null) => {
      const taskDate = new Date(task.createdAt);
      if (endDate) {
        return taskDate >= startDate && taskDate <= endDate;
      }
      return taskDate >= startDate;
    };

    // Calculate daily progress
    const dailyTasks = [...tasks.daily];
    const dailyCompleted = dailyTasks.filter(t => t.completed).length;
    const dailyTotal = dailyTasks.length;
    const dailyProgress = dailyTotal > 0 ? Math.round((dailyCompleted / dailyTotal) * 100) : 0;

    // Calculate weekly progress
    const weeklyTasks = [...tasks.weekly];
    const weeklyCompleted = weeklyTasks.filter(t => t.completed).length;
    const weeklyTotal = weeklyTasks.length;
    const weeklyProgress = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;

    // Calculate monthly progress
    const monthlyTasks = [...tasks.monthly];
    const monthlyCompleted = monthlyTasks.filter(t => t.completed).length;
    const monthlyTotal = monthlyTasks.length;
    const monthlyProgress = monthlyTotal > 0 ? Math.round((monthlyCompleted / monthlyTotal) * 100) : 0;

    // Calculate overall progress
    const allTasks = [...tasks.daily, ...tasks.weekly, ...tasks.monthly];
    const allCompleted = allTasks.filter(t => t.completed).length;
    const allTotal = allTasks.length;
    const overallProgress = allTotal > 0 ? Math.round((allCompleted / allTotal) * 100) : 0;

    return {
      daily: { completed: dailyCompleted, total: dailyTotal, progress: dailyProgress },
      weekly: { completed: weeklyCompleted, total: weeklyTotal, progress: weeklyProgress },
      monthly: { completed: monthlyCompleted, total: monthlyTotal, progress: monthlyProgress },
      overall: { completed: allCompleted, total: allTotal, progress: overallProgress }
    };
  }, [tasks]);

  const ProgressCard = ({ title, data, gradient, delay = 0 }) => (
    <div className="progress-card glass" style={{ animationDelay: `${delay}ms` }}>
      <div className="progress-header">
        <h3 className="progress-title">{title}</h3>
        <span className="progress-percentage">{data.progress}%</span>
      </div>
      <div className="progress-stats">
        <span className="progress-stats-text">
          {data.completed} of {data.total} tasks completed
        </span>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar-track">
          <div 
            className={`progress-bar-fill ${gradient}`}
            style={{ 
              width: `${data.progress}%`,
              animationDelay: `${delay + 200}ms`
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-overlay">
      <div className="dashboard-container glass">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Dashboard</h2>
          <button className="dashboard-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="dashboard-content">
          {/* Gamification Section */}
          {gamificationData && (
            <div className="gamification-section">
              <div className="gamification-grid">
                <LevelProgressBar 
                  level={gamificationData.level}
                  levelTitle={gamificationData.levelTitle}
                  xpProgress={gamificationData.xpProgress}
                  xpForNextLevel={gamificationData.xpForNextLevel}
                  points={gamificationData.points}
                />
                <BadgeDisplay 
                  badges={gamificationData.badges}
                />
              </div>
              
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card glass">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-value">{gamificationData.streaks?.current || 0}</div>
                  <div className="stat-label">Current Streak</div>
                </div>
                <div className="stat-card glass">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-value">{gamificationData.badges?.length || 0}</div>
                  <div className="stat-label">Badges Earned</div>
                </div>
                <div className="stat-card glass">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-value">{gamificationData.achievements?.totalTasksCompleted || 0}</div>
                  <div className="stat-label">Tasks Completed</div>
                </div>
                <div className="stat-card glass">
                  <div className="stat-icon">📈</div>
                  <div className="stat-value">{gamificationData.streaks?.longest || 0}</div>
                  <div className="stat-label">Longest Streak</div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Section */}
          <div className="progress-grid">
            <ProgressCard 
              title="Daily Progress" 
              data={progressData.daily}
              gradient="gradient-purple-blue"
              delay={0}
            />
            <ProgressCard 
              title="Weekly Progress" 
              data={progressData.weekly}
              gradient="gradient-blue-teal"
              delay={100}
            />
            <ProgressCard 
              title="Monthly Progress" 
              data={progressData.monthly}
              gradient="gradient-teal-green"
              delay={200}
            />
            <ProgressCard 
              title="Overall Progress" 
              data={progressData.overall}
              gradient="gradient-pink-violet"
              delay={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
