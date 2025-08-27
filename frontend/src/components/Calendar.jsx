import React from 'react';
import './CalendarClock.css';

const Calendar = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.toLocaleString('default', { month: 'long' });
  const dayName = now.toLocaleString('default', { weekday: 'long' });
  const currentDate = now.getDate();

  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const startOffset = (firstDay + 6) % 7; // Monday start
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dateNum = i - startOffset + 1;
    const date = new Date(now.getFullYear(), now.getMonth(), dateNum);
    const isCurrentMonth = dateNum >= 1 && dateNum <= daysInMonth;
    const isToday = isCurrentMonth && date.getDate() === now.getDate();
    return (
      <div key={i} className={`cal-cell ${isCurrentMonth ? '' : 'muted'} ${isToday ? 'today' : ''}`}>
        {isCurrentMonth ? dateNum : ''}
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


