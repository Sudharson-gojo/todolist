import { useState, useEffect } from 'react';
import { UserProgress, Task, CompletionResult, CalendarDay } from '../types/gamification';

const API_BASE = 'http://localhost:5000/api';

export const useGamification = () => {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile and progress
  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/me`);
      const data = await response.json();
      if (data.success) {
        setUser(data.data.user);
      }
    } catch (err) {
      setError('Failed to fetch user data');
    }
  };

  // Fetch tasks for a specific range
  const fetchTasks = async (range: 'today' | 'week' | 'month' = 'today') => {
    try {
      const response = await fetch(`${API_BASE}/tasks?range=${range}`);
      const data = await response.json();
      if (data.success) {
        setTasks(data.data.tasks);
      }
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  // Fetch calendar data
  const fetchCalendar = async (month: string) => {
    try {
      const response = await fetch(`${API_BASE}/calendar?month=${month}`);
      const data = await response.json();
      if (data.success) {
        setCalendarData(data.data.calendar);
      }
    } catch (err) {
      setError('Failed to fetch calendar data');
    }
  };

  // Complete a task
  const completeTask = async (taskId: string): Promise<CompletionResult | null> => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${taskId}/complete`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setTasks(prev => prev.map(task => 
          task.id === taskId ? data.data.task : task
        ));
        
        // Update user progress
        if (user) {
          setUser(prev => ({
            ...prev,
            progress: data.data.progress
          }));
        }
        
        return data.data;
      }
      return null;
    } catch (err) {
      setError('Failed to complete task');
      return null;
    }
  };

  // Create a new task
  const createTask = async (title: string, frequency: 'daily' | 'weekly' | 'monthly') => {
    try {
      const now = new Date();
      let assignedFor: string;
      
      switch (frequency) {
        case 'daily':
          assignedFor = now.toISOString().split('T')[0];
          break;
        case 'weekly':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          assignedFor = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          assignedFor = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          break;
      }

      const newTask: Task = {
        id: `task-${Date.now()}`,
        userId: 'user-1',
        title,
        frequency,
        assignedFor,
        createdAt: now.toISOString()
      };

      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      return null;
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUser(),
        fetchTasks('today'),
        fetchCalendar(new Date().toISOString().slice(0, 7))
      ]);
      setLoading(false);
    };

    initializeData();
  }, []);

  return {
    user,
    tasks,
    calendarData,
    loading,
    error,
    completeTask,
    createTask,
    fetchTasks,
    fetchCalendar,
    refreshUser: fetchUser
  };
};
