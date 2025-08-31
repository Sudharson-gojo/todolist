import React from 'react';

interface LinearProgressBarProps {
  value: number; // 0-100
  label: string;
  hint?: string;
  className?: string;
  animated?: boolean;
}

export const LinearProgressBar: React.FC<LinearProgressBarProps> = ({
  value,
  label,
  hint,
  className = '',
  animated = true
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white/90">{label}</span>
        <span className="text-sm font-semibold text-white">{clampedValue}%</span>
      </div>
      
      {hint && (
        <p className="text-xs text-white/70 mb-3">{hint}</p>
      )}
      
      <div 
        className="relative h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${clampedValue}%`}
      >
        {/* Progress fill with gradient */}
        <div
          className={`
            h-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 rounded-full
            shadow-[0_0_20px_rgba(168,85,247,0.4)]
            ${animated ? 'transition-[width] duration-700 ease-out' : ''}
          `}
          style={{ width: `${clampedValue}%` }}
        />
        
        {/* Subtle glow overlay */}
        <div
          className={`
            absolute top-0 h-full bg-gradient-to-r from-white/20 to-transparent rounded-full
            ${animated ? 'transition-[width] duration-700 ease-out' : ''}
          `}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
