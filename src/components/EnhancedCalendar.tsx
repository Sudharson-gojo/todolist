import React from 'react';
import { CalendarDay } from '../types/gamification';

interface EnhancedCalendarProps {
  calendarData: CalendarDay[];
  currentDate: Date;
  onDateSelect?: (date: string) => void;
}

export const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({
  calendarData,
  currentDate,
  onDateSelect
}) => {
  const today = new Date().toISOString().split('T')[0];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday start
  const daysInMonth = lastDay.getDate();

  const renderTaskDots = (day: CalendarDay) => {
    const dots = [];
    
    if (day.assignments.daily) {
      dots.push(
        <div
          key="daily"
          className={`w-2 h-2 rounded-full ${
            day.completions.daily 
              ? 'bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]' 
              : 'border border-green-400/60 bg-transparent'
          }`}
          title="Daily task"
        />
      );
    }
    
    if (day.assignments.weekly) {
      dots.push(
        <div
          key="weekly"
          className={`w-2 h-2 rounded-full ${
            day.completions.weekly 
              ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]' 
              : 'border border-red-400/60 bg-transparent'
          }`}
          title="Weekly task"
        />
      );
    }
    
    if (day.assignments.monthly) {
      dots.push(
        <div
          key="monthly"
          className={`w-2 h-2 rounded-full ${
            day.completions.monthly 
              ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]' 
              : 'border border-orange-400/60 bg-transparent'
          }`}
          title="Monthly task"
        />
      );
    }

    return dots;
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-4 text-xs text-white/70">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Daily</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Weekly</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>Monthly</span>
          </div>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-white/70 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: startOffset }).map((_, index) => (
          <div key={`empty-${index}`} className="h-12" />
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const dayNumber = index + 1;
          const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
          const dayData = calendarData.find(d => d.date === dateStr);
          const isToday = dateStr === today;
          const isStreakDay = dayData?.isStreakDay;

          return (
            <button
              key={dayNumber}
              onClick={() => onDateSelect?.(dateStr)}
              className={`
                relative h-12 rounded-lg transition-all duration-200 group
                ${isToday 
                  ? 'bg-white/20 border border-white/30 text-white font-semibold' 
                  : 'hover:bg-white/10 text-white/90'
                }
                ${isStreakDay 
                  ? 'ring-2 ring-fuchsia-400/50 shadow-[0_0_20px_rgba(217,70,239,0.3)]' 
                  : ''
                }
              `}
            >
              {/* Streak glow background */}
              {isStreakDay && (
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 to-indigo-500/20 rounded-lg" />
              )}
              
              {/* Day number */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <span className="text-sm">{dayNumber}</span>
                
                {/* Task dots */}
                {dayData && (
                  <div className="flex space-x-1 mt-1">
                    {renderTaskDots(dayData)}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="text-xs text-white/70 space-y-1">
          <div>• Solid dots: completed tasks</div>
          <div>• Outlined dots: pending tasks</div>
          <div>• Glowing border: streak day</div>
        </div>
      </div>
    </div>
  );
};
