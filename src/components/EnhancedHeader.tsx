import React from 'react';
import { LinearProgressBar } from './LinearProgressBar';

interface EnhancedHeaderProps {
  user: {
    name: string;
    progress: {
      level: number;
      xp: number;
      points: number;
    };
    levelName: string;
    nextLevelXP: number;
    currentLevelXP: number;
  };
  onDashboardToggle: () => void;
  onLogout: () => void;
}

export const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({
  user,
  onDashboardToggle,
  onLogout
}) => {
  const xpProgress = ((user.progress.xp) / (user.nextLevelXP - user.currentLevelXP)) * 100;

  return (
    <header className="bg-white/10 backdrop-blur-xl border-b border-white/15 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
          </div>

          {/* Center - Level & XP Bar */}
          <div className="hidden md:flex items-center space-x-6 flex-1 max-w-md mx-8">
            <div className="flex items-center space-x-3">
              <div className="text-sm text-white/90">
                Level {user.progress.level} · {user.levelName}
              </div>
            </div>
            <div className="flex-1">
              <LinearProgressBar
                value={xpProgress}
                label=""
                className="mb-0"
                animated={true}
              />
              <div className="flex justify-between text-xs text-white/70 mt-1">
                <span>{user.progress.xp} XP</span>
                <span>{user.nextLevelXP - user.currentLevelXP} XP</span>
              </div>
            </div>
          </div>

          {/* Right side - Profile & Controls */}
          <div className="flex items-center space-x-4">
            {/* Dashboard Button */}
            <button
              onClick={onDashboardToggle}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Open Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>

            {/* Profile Chip */}
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-white">{user.name}</div>
                <div className="text-xs text-white/70">{user.progress.points} points</div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile XP Bar */}
        <div className="md:hidden pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/90">
              Level {user.progress.level} · {user.levelName}
            </span>
            <span className="text-xs text-white/70">
              {user.progress.xp}/{user.nextLevelXP - user.currentLevelXP} XP
            </span>
          </div>
          <LinearProgressBar
            value={xpProgress}
            label=""
            className="mb-0"
            animated={true}
          />
        </div>
      </div>
    </header>
  );
};
