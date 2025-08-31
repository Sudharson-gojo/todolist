import React, { useState } from 'react';
import { EnhancedHeader } from './components/EnhancedHeader';
import { DashboardView } from './components/DashboardView';
import { EnhancedCalendar } from './components/EnhancedCalendar';
import { TaskCard } from './components/TaskCard';
import { CompletionEffects } from './components/CompletionEffects';
import { useGamification } from './hooks/useGamification';

function App() {
  const {
    user,
    tasks,
    calendarData,
    loading,
    error,
    completeTask,
    createTask,
    fetchTasks
  } = useGamification();

  const [showDashboard, setShowDashboard] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskFrequency, setNewTaskFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [completionEffect, setCompletionEffect] = useState<{
    show: boolean;
    type: 'task' | 'levelUp' | 'badge';
    message?: string;
  }>({ show: false, type: 'task' });

  const handleTaskComplete = async (taskId: string) => {
    const result = await completeTask(taskId);
    if (result) {
      // Show completion effects
      if (result.levelUp) {
        setCompletionEffect({
          show: true,
          type: 'levelUp',
          message: `Welcome to Level ${result.progress.level}!`
        });
      } else if (result.newBadges && result.newBadges.length > 0) {
        setCompletionEffect({
          show: true,
          type: 'badge',
          message: result.newBadges[0].name
        });
      } else if (result.pointsEarned > 0) {
        setCompletionEffect({
          show: true,
          type: 'task',
          message: `+${result.pointsEarned} points earned!`
        });
      }
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      await createTask(newTaskTitle.trim(), newTaskFrequency);
      setNewTaskTitle('');
      fetchTasks('today');
    }
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logout clicked');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error || 'Failed to load user data'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Enhanced Header */}
      <EnhancedHeader
        user={user}
        onDashboardToggle={() => setShowDashboard(!showDashboard)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Task Form */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Add New Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-4">
                  <select
                    value={newTaskFrequency}
                    onChange={(e) => setNewTaskFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white rounded-xl font-medium hover:from-fuchsia-600 hover:to-indigo-600 transition-all duration-200 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>

            {/* Tasks List */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Today's Tasks</h2>
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-white/70 text-center py-8">No tasks for today. Add one above!</p>
                ) : (
                  tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleTaskComplete}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="space-y-6">
            <EnhancedCalendar
              calendarData={calendarData}
              currentDate={new Date()}
            />

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Current Streak</span>
                  <span className="text-white font-medium">{user.progress.streaks.daily} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Total Points</span>
                  <span className="text-white font-medium">{user.progress.points}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Badges Earned</span>
                  <span className="text-white font-medium">{user.progress.badges.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dashboard Modal */}
      {showDashboard && (
        <DashboardView
          progress={user.progress}
          levelName={user.levelName}
          nextLevelXP={user.nextLevelXP}
          currentLevelXP={user.currentLevelXP}
          onClose={() => setShowDashboard(false)}
        />
      )}

      {/* Completion Effects */}
      <CompletionEffects
        show={completionEffect.show}
        type={completionEffect.type}
        message={completionEffect.message}
        onComplete={() => setCompletionEffect({ show: false, type: 'task' })}
      />
    </div>
  );
}

export default App;
