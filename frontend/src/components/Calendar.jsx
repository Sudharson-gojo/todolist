import React from 'react';
import './CalendarClock.css';

const Calendar = ({ tasks = { daily: [], weekly: [], monthly: [] }, streaks = { current: 0 } }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.toLocaleString('default', { month: 'long' });
  const dayName = now.toLocaleString('default', { weekday: 'long' });
  const currentDate = now.getDate();

  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const startOffset = (firstDay + 6) % 7; // Monday start
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  // Helper function to get task indicators for a specific date
  const getTaskIndicators = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const indicators = [];
    
    // Check for daily tasks
    const dailyTasks = (tasks.daily || []).filter(task => {
      if (!task || !task.createdAt) return false;
      const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
    if (dailyTasks.length > 0) {
      indicators.push({ type: 'daily', completed: dailyTasks.every(t => t && t.completed) });
    }
    
    // Check for weekly tasks (show on all days of the week they were created)
    const weeklyTasks = (tasks.weekly || []).filter(task => {
      if (!task || !task.createdAt) return false;
      const taskDate = new Date(task.createdAt);
      const taskWeekStart = new Date(taskDate);
      taskWeekStart.setDate(taskDate.getDate() - taskDate.getDay());
      const taskWeekEnd = new Date(taskWeekStart);
      taskWeekEnd.setDate(taskWeekStart.getDate() + 6);
      
      return date >= taskWeekStart && date <= taskWeekEnd;
    });
    if (weeklyTasks.length > 0) {
      indicators.push({ type: 'weekly', completed: weeklyTasks.every(t => t && t.completed) });
    }
    
    // Check for monthly tasks (show on all days of the month they were created)
    const monthlyTasks = (tasks.monthly || []).filter(task => {
      if (!task || !task.createdAt) return false;
      const taskDate = new Date(task.createdAt);
      return taskDate.getMonth() === date.getMonth() && taskDate.getFullYear() === date.getFullYear();
    });
    if (monthlyTasks.length > 0) {
      indicators.push({ type: 'monthly', completed: monthlyTasks.every(t => t && t.completed) });
    }
    
    return indicators;
  };

  // Helper function to check if date is part of current streak
  const isStreakDay = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - checkDate) / (1000 * 60 * 60 * 24));
    return daysDiff >= 0 && daysDiff < streaks.current;
  };

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dateNum = i - startOffset + 1;
    const date = new Date(now.getFullYear(), now.getMonth(), dateNum);
    const isCurrentMonth = dateNum >= 1 && dateNum <= daysInMonth;
    const isToday = isCurrentMonth && date.getDate() === now.getDate();
    const taskIndicators = isCurrentMonth ? getTaskIndicators(date) : [];
    const isStreak = isCurrentMonth && isStreakDay(date);
    
    return (
      <div key={i} className={`cal-cell ${isCurrentMonth ? '' : 'muted'} ${isToday ? 'today' : ''} ${isStreak ? 'streak-day' : ''}`}>
        {isCurrentMonth ? (
          <>
            <span className="cal-date-number">{dateNum}</span>
            {taskIndicators.length > 0 && (
              <div className="task-indicators">
                {taskIndicators.map((indicator, idx) => (
                  <div 
                    key={idx} 
                    className={`task-dot ${indicator.type} ${indicator.completed ? 'completed' : 'pending'}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : ''}
      </div>
    );
  });

  return (
    <div className="calendar-container">
      {/* Large Date Display */}
      <div className="glass card large-date-card">
        <div className="month-year">{month} {year}</div>
        <div className="current-date">{currentDate}</div>
        <div className="day-name">{dayName}</div>
      </div>
      
      {/* Small Calendar Grid */}
      <div className="glass card mini-calendar-card">
        <div className="cal-grid">
          {['S','M','T','W','T','F','S'].map((d) => (
            <div key={d} className="cal-head">{d}</div>
          ))}
          {cells}
        </div>
      </div>
    </div>
  );
};

export default Calendar;


