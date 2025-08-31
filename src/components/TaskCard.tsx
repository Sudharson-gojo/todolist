import React from 'react';
import { Task } from '../types/gamification';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onDelete
}) => {
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'border-green-400/30 bg-green-500/10';
      case 'weekly': return 'border-red-400/30 bg-red-500/10';
      case 'monthly': return 'border-orange-400/30 bg-orange-500/10';
      default: return 'border-white/20 bg-white/5';
    }
  };

  const getFrequencyDot = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-green-400';
      case 'weekly': return 'bg-red-400';
      case 'monthly': return 'bg-orange-400';
      default: return 'bg-white/50';
    }
  };

  return (
    <div className={`
      bg-white/10 backdrop-blur-xl border rounded-2xl p-4 
      shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition-all duration-300
      ${task.completedAt ? 'opacity-75' : 'hover:bg-white/15'}
      ${getFrequencyColor(task.frequency)}
    `}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Completion checkbox */}
          <button
            onClick={() => onComplete(task.id)}
            className={`
              w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
              ${task.completedAt 
                ? 'bg-white border-white text-gray-900' 
                : 'border-white/50 hover:border-white'
              }
            `}
          >
            {task.completedAt && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Task content */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${getFrequencyDot(task.frequency)}`} />
              <span className="text-xs text-white/70 capitalize">{task.frequency}</span>
            </div>
            <h3 className={`
              text-white font-medium transition-all duration-200
              ${task.completedAt ? 'line-through opacity-75' : ''}
            `}>
              {task.title}
            </h3>
            {task.completedAt && (
              <p className="text-xs text-white/60 mt-1">
                Completed {new Date(task.completedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            className="text-white/50 hover:text-red-400 transition-colors p-1"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
