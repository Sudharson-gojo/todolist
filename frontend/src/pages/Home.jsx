import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Navbar removed per template; lightweight profile shown instead
import LoadingSpinner from '../components/LoadingSpinner';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import AddTaskForm from '../components/AddTaskForm';
import Calendar from '../components/Calendar';
import Clock from '../components/Clock';
import Dashboard from '../components/Dashboard';
import LevelProgressBar from '../components/LevelProgressBar';
import BadgeDisplay from '../components/BadgeDisplay';
import CompletionAnimation from '../components/CompletionAnimation';
import '../components/CalendarClock.css';

const Home = () => {
  const { user, token, logout } = useAuth();
  const gamification = useGamification();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [tasks, setTasks] = useState({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchAllTasks();
  }, []);

  // Fetch all tasks for the user (grouped by category)
  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks for each category
      const [dailyRes, weeklyRes, monthlyRes] = await Promise.all([
        axios.get('/api/tasks?category=daily', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('/api/tasks?category=weekly', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('/api/tasks?category=monthly', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setTasks({
        daily: dailyRes.data.data.tasks,
        weekly: weeklyRes.data.data.tasks,
        monthly: monthlyRes.data.data.tasks
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error.response?.status === 401) {
        logout(); // Clear token and redirect to login
      } else {
        setError('Failed to load tasks');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (title, category) => {
    try {
      const response = await axios.post('/api/tasks', 
        { title, category },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Add the new task to the appropriate category
      const newTaskData = response.data.data?.task;
      if (newTaskData) {
        setTasks(prevTasks => ({
          ...prevTasks,
          [category]: [newTaskData, ...(prevTasks[category] || [])]
        }));
      }
      
      setError(null);
    } catch (error) {
      console.error('Error adding task:', error);
      if (error.response?.status === 401) {
        logout();
      } else {
        setError('Failed to add task');
        throw error;
      }
    }
  };

  // Toggle task completion with gamification
  const toggleTask = async (taskId, category) => {
    try {
      const gamificationResult = await gamification.processTaskCompletion(taskId, category);
      
      // Update the task in the appropriate category
      setTasks(prevTasks => ({
        ...prevTasks,
        [category]: (prevTasks[category] || []).map(task => {
          if (task && task.id === taskId) {
            // If gamificationResult has task data, use it, otherwise toggle the completed status
            if (gamificationResult && gamificationResult.task) {
              return gamificationResult.task;
            } else {
              return { ...task, completed: !task.completed };
            }
          }
          return task;
        }).filter(Boolean) // Remove any null/undefined tasks
      }));
      setError(null);
    } catch (error) {
      console.error('Error updating task:', error);
      if (error.response?.status === 401) {
        logout();
      } else {
        setError('Failed to update task');
      }
    }
  };

  // Delete a task
  const deleteTask = async (taskId, category) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Remove the task from the appropriate category
      setTasks(prevTasks => ({
        ...prevTasks,
        [category]: prevTasks[category].filter(task => task.id !== taskId)
      }));
      setError(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      if (error.response?.status === 401) {
        // Handle logout in navbar
      } else {
        setError('Failed to delete task');
      }
    }
  };

  // Get total task count
  const getTotalTasks = () => {
    return tasks.daily.length + tasks.weekly.length + tasks.monthly.length;
  };

  // Get completed task count
  const getCompletedTasks = () => {
    return tasks.daily.filter(t => t.completed).length + 
           tasks.weekly.filter(t => t.completed).length + 
           tasks.monthly.filter(t => t.completed).length;
  };

  // Get pending task count
  const getPendingTasks = () => {
    return getTotalTasks() - getCompletedTasks();
  };

  // Get completion percentage
  const getCompletionPercent = () => {
    const total = getTotalTasks();
    if (total === 0) return 0;
    return Math.round((getCompletedTasks() / total) * 100);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#2d3748', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 1240, margin: '0 auto', padding: '24px' }}>
        {/* Header with profile and level info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#2d3748', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </button>
            {menuOpen && (
              <div role="menu" style={{ position: 'absolute', top: 44, right: 0, minWidth: 180, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 12, boxShadow: '0 12px 30px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 50, backdropFilter: 'blur(10px)' }}>
                <div style={{ padding: '8px 12px', fontSize: 12, opacity: 0.8, color: '#4a5568' }}>Signed in as</div>
                <div style={{ padding: '0 12px 8px 12px', fontWeight: 600, color: '#1a202c' }}>{user?.name || 'User'}</div>
                <div style={{ height: 1, background: 'var(--glass-border)' }} />
                <button onClick={handleLogout} role="menuitem" style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '10px 12px', color: '#2d3748', cursor: 'pointer' }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,215,0,0.08)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontWeight: 600 }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Level {gamification.level}: {gamification.levelTitle}
            </div>
          </div>
          <button
            onClick={() => setShowDashboard(true)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 12,
              padding: '8px 16px',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Dashboard
          </button>
        </div>

        {/* Dashboard grid to mimic template */}
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
          {/* Left column: top Calendar, bottom big Clock */}
          <div style={{ display: 'grid', gap: 24 }}>
            <Calendar tasks={tasks} streaks={gamification.streaks} />
            <Clock />
          </div>

          {/* Right column: gamification, input and todo list panel */}
          <div className="right-stack">
            {/* Level Progress Bar */}
            <LevelProgressBar 
              level={gamification.level}
              levelTitle={gamification.levelTitle}
              xpProgress={gamification.xpProgress}
              xpForNextLevel={gamification.xpForNextLevel}
              points={gamification.points}
              showAnimation={gamification.animations.showLevelUp}
            />

            {/* Badge Display */}
            <BadgeDisplay 
              badges={gamification.badges}
              newBadges={gamification.animations.newBadges}
              showAnimation={gamification.animations.showBadgeUnlock}
            />

            <div className="glass card glass-card">
              <div className="card-header">Write here anythings</div>
              <AddTaskForm onAddTask={addTask} />
            </div>

            {/* Single Todo List panel with 3 sections */}
            <div className="glass card glass-card">
              <div className="card-header">Todo List</div>
              {error && (
                <div className="mb-6 p-4" style={{ background: 'rgba(255, 0, 0, 0.15)', border: '1px solid rgba(255,0,0,0.3)', borderRadius: 8 }}>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
              {loading ? (
                <LoadingSpinner message="Loading your tasks..." />
              ) : (
                <div style={{ display: 'grid', gap: 16 }}>
                  {['daily','weekly','monthly'].map((cat) => {
                    const categoryTasks = tasks[cat] || [];
                    const pending = categoryTasks.filter(t => t && !t.completed);
                    const completed = categoryTasks.filter(t => t && t.completed);
                    const titles = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };
                    return (
                      <div key={cat}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>{titles[cat]}</div>
                        <div className="grid" style={{ gap: 12 }}>
                          {[...pending, ...completed].map(task => 
                            task && task.id ? (
                              <TaskCard key={task.id} task={task} category={cat} onToggle={toggleTask} onDelete={deleteTask} />
                            ) : null
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Modal */}
        {showDashboard && (
          <Dashboard 
            tasks={tasks} 
            gamificationData={gamification}
            onClose={() => setShowDashboard(false)} 
          />
        )}

        {/* Completion Animations */}
        <CompletionAnimation
          show={gamification.animations.showTaskComplete}
          type="task"
          message={gamification.animations.animationMessage}
          onComplete={gamification.clearAnimations}
        />
        
        <CompletionAnimation
          show={gamification.animations.showBadgeUnlock}
          type="badge"
          message={gamification.animations.animationMessage}
          onComplete={gamification.clearAnimations}
        />
        
        <CompletionAnimation
          show={gamification.animations.showLevelUp}
          type="levelup"
          message={gamification.animations.animationMessage}
          onComplete={gamification.clearAnimations}
        />
      </div>
    </div>
  );
};

export default Home;
