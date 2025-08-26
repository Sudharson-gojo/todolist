import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import AddTaskForm from '../components/AddTaskForm';

const Home = () => {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const newTaskData = response.data.data.task;
      setTasks(prevTasks => ({
        ...prevTasks,
        [category]: [newTaskData, ...prevTasks[category]]
      }));
      
      setError(null);
    } catch (error) {
      console.error('Error adding task:', error);
      if (error.response?.status === 401) {
        // Handle logout in navbar
      } else {
        setError('Failed to add task');
        throw error;
      }
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId, category) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Update the task in the appropriate category
      setTasks(prevTasks => ({
        ...prevTasks,
        [category]: prevTasks[category].map(task => 
          task.id === taskId ? response.data.data.task : task
        )
      }));
      setError(null);
    } catch (error) {
      console.error('Error updating task:', error);
      if (error.response?.status === 401) {
        // Handle logout in navbar
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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="welcome-title mb-2">
            Welcome back, {user?.name || 'Achiever'}! 👋
          </h1>
          <p className="welcome-subtitle">Here's your roadmap to an amazing day</p>
        </div>

        {/* Motivational Quote */}
        <div className="quote-card card mb-8">
          <div className="quote-accent" />
          <p className="quote-text">“Small progress is still progress. Keep going — future you is proud.”</p>
          <p className="quote-author">Your Productivity Coach</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 mb-8 md-grid-cols-2 lg-grid-cols-4">
          <StatsCard
            title="Total Tasks"
            count={getTotalTasks()}
            icon="📋"
            color="blue"
            description="All categories"
          />
          <StatsCard
            title="Pending Tasks"
            count={getPendingTasks()}
            icon="⏳"
            color="orange"
            description="Need attention"
            progress={getTotalTasks() > 0 ? Math.round((getPendingTasks() / getTotalTasks()) * 100) : 0}
          />
          <StatsCard
            title="Completed Tasks"
            count={getCompletedTasks()}
            icon="✅"
            color="green"
            description="Great job!"
            progress={getCompletionPercent()}
          />
          <StatsCard
            title="Completion Rate"
            count={getTotalTasks() > 0 ? `${Math.round((getCompletedTasks() / getTotalTasks()) * 100)}%` : '0%'}
            icon="📊"
            color="purple"
            description="Your progress"
            progress={getCompletionPercent()}
          />
        </div>

        {/* Category Navigation Cards removed as requested */}

        {/* Quick Add Task removed as requested */}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-400 rounded-md">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Recent Tasks removed as requested */}
      </div>
    </div>
  );
};

export default Home;
