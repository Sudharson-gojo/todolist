import React from 'react';
import { LinearProgressBar } from './LinearProgressBar';
import { UserProgress, Badge } from '../types/gamification';

interface DashboardViewProps {
  progress: UserProgress;
  levelName: string;
  nextLevelXP: number;
  currentLevelXP: number;
  onClose: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  progress,
  levelName,
  nextLevelXP,
  currentLevelXP,
  onClose
}) => {
  const xpProgress = ((progress.xp) / (nextLevelXP - currentLevelXP)) * 100;
  
  const badgeDefinitions = {
    earlyBird: { name: 'Early Bird', description: 'Complete tasks between 5:00-9:00 AM', icon: '🌅' },
    consistencyKing: { name: 'Consistency King', description: 'Complete all daily tasks for 7 consecutive days', icon: '👑' },
    weeklyChampion: { name: 'Weekly Champion', description: 'Complete all weekly tasks within the week', icon: '🏆' }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-2xl font-semibold text-white">Progress Dashboard</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Daily Progress */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <LinearProgressBar
                value={progress.progress.dailyPct}
                label="Daily Tasks"
                hint="Today's progress"
              />
            </div>

            {/* Weekly Progress */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <LinearProgressBar
                value={progress.progress.weeklyPct}
                label="Weekly Tasks"
                hint="This week's progress"
              />
            </div>

            {/* Monthly Progress */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <LinearProgressBar
                value={progress.progress.monthlyPct}
                label="Monthly Tasks"
                hint="This month's progress"
              />
            </div>

            {/* Overall Progress */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <LinearProgressBar
                value={progress.progress.overallPct}
                label="Overall Progress"
                hint="Combined completion rate"
              />
            </div>
          </div>

          {/* Points & Level Summary */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Level & Points</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/90">Current Points</span>
                  <span className="text-2xl font-bold text-white">{progress.points}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/90">Level {progress.level}</span>
                  <span className="text-white font-medium">{levelName}</span>
                </div>
                <div className="text-sm text-white/70">
                  Next milestone: Level {progress.level + 1} ({nextLevelXP - progress.xp} XP needed)
                </div>
              </div>
              <div>
                <LinearProgressBar
                  value={xpProgress}
                  label={`XP Progress (${progress.xp}/${nextLevelXP - currentLevelXP})`}
                  hint={`${nextLevelXP - progress.xp} XP to next level`}
                />
              </div>
            </div>
          </div>

          {/* Badges Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(badgeDefinitions).map(([id, badge]) => {
                const earned = progress.badges.find(b => b.id === id);
                return (
                  <div
                    key={id}
                    className={`
                      p-4 rounded-lg border transition-all duration-300
                      ${earned 
                        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 shadow-[0_0_20px_rgba(251,191,36,0.2)]' 
                        : 'bg-white/5 border-white/10 opacity-60'
                      }
                    `}
                    title={badge.description}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className="font-medium text-white text-sm">{badge.name}</div>
                      <div className="text-xs text-white/70 mt-1">{badge.description}</div>
                      {earned && (
                        <div className="text-xs text-yellow-400 mt-2">
                          Earned {new Date(earned.earnedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Streaks */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Streaks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{progress.streaks.daily}</div>
                <div className="text-white/90">Current Daily Streak</div>
                <div className="text-sm text-white/70">days in a row</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{progress.streaks.bestDaily}</div>
                <div className="text-white/90">Best Daily Streak</div>
                <div className="text-sm text-white/70">personal record</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
