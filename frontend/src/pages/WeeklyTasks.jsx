import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskCard from '../components/TaskCard';
import AddTaskForm from '../components/AddTaskForm';

const WeeklyTasks = () => {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch weekly tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks?category=weekly', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTasks(response.data.data.tasks);
      setError(null);
    } catch (error) {
      console.error('Error fetching weekly tasks:', error);
      if (error.response?.status === 401) {
        logout();
      } else {
        setError('Failed to load weekly tasks');
      }
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title, category) => {
    try {
      const response = await axios.post('/api/tasks', 
        { title, category },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setTasks(prevTasks => [response.data.data.task, ...prevTasks]);
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

  const toggleTask = async (taskId, category) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? response.data.data.task : task
        )
      );
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

  const deleteTask = async (taskId, category) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setError(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      if (error.response?.status === 401) {
        logout();
      } else {
        setError('Failed to delete task');
      }
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="min-h-screen tasks-page">
      <Navbar />
      
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="tasks-title mb-2">Weekly Tasks</h1>
          <p className="tasks-subtitle">Consistency compounds.</p>
        </div>

        {/* Add Task Form */}
        <AddTaskForm onAddTask={addTask} defaultCategory="weekly" />

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-400 rounded-md">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <LoadingSpinner message="Loading your weekly tasks..." />
        ) : (
          <div className="space-y-8">
            {/* Pending Tasks */}
            <div className="tasks-section pending">
              <h2 className="section-title">
                Pending Tasks ({pendingTasks.length})
              </h2>
              {pendingTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📆</div>
                  <h3 className="text-lg font-medium text-white mb-2">No pending weekly tasks</h3>
                  <p className="text-white opacity-80">Add your first weekly task above!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {pendingTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      category="weekly"
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="tasks-section completed">
                <h2 className="section-title">
                  Completed Tasks ({completedTasks.length})
                </h2>
                <p className="section-subtitle">You’re doing great 💪</p>
                <div className="grid gap-4">
                  {completedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      category="weekly"
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyTasks;
