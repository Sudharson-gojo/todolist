import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const GamificationContext = createContext();

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const { token } = useAuth();
  const [gamificationData, setGamificationData] = useState({
    points: 0,
    level: 1,
    levelTitle: 'Beginner',
    xp: 0,
    xpProgress: 0,
    xpNeeded: 100,
    xpForNextLevel: 100,
    badges: [],
    achievements: {},
    streaks: { current: 0, longest: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [animations, setAnimations] = useState({
    showTaskComplete: false,
    showBadgeUnlock: false,
    showLevelUp: false,
    newBadges: [],
    animationMessage: ''
  });

  // Fetch gamification stats
  const fetchGamificationStats = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks/gamification/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setGamificationData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching gamification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process task completion with gamification
  const processTaskCompletion = async (taskId, category) => {
    if (!token) return null;
    
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.data.gamification) {
        const gamificationResult = response.data.data.gamification;
        
        // Update gamification data
        await fetchGamificationStats();
        
        // Show animations based on what happened
        if (gamificationResult.pointsAwarded > 0) {
          showTaskCompleteAnimation(`+${gamificationResult.pointsAwarded} points!`);
        }
        
        if (gamificationResult.newBadges && gamificationResult.newBadges.length > 0) {
          showBadgeUnlockAnimation(gamificationResult.newBadges);
        }
        
        if (gamificationResult.leveledUp) {
          showLevelUpAnimation(`Level ${gamificationResult.newLevel}!`);
        }
        
        return gamificationResult;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error processing task completion:', error);
      throw error;
    }
  };

  // Animation functions
  const showTaskCompleteAnimation = (message) => {
    setAnimations(prev => ({
      ...prev,
      showTaskComplete: true,
      animationMessage: message
    }));
  };

  const showBadgeUnlockAnimation = (newBadges) => {
    setAnimations(prev => ({
      ...prev,
      showBadgeUnlock: true,
      newBadges,
      animationMessage: `New badge${newBadges.length > 1 ? 's' : ''} unlocked!`
    }));
  };

  const showLevelUpAnimation = (message) => {
    setAnimations(prev => ({
      ...prev,
      showLevelUp: true,
      animationMessage: message
    }));
  };

  const clearAnimations = () => {
    setAnimations({
      showTaskComplete: false,
      showBadgeUnlock: false,
      showLevelUp: false,
      newBadges: [],
      animationMessage: ''
    });
  };

  // Fetch stats on mount and when token changes
  useEffect(() => {
    if (token) {
      fetchGamificationStats();
    }
  }, [token]);

  const value = {
    ...gamificationData,
    loading,
    animations,
    fetchGamificationStats,
    processTaskCompletion,
    showTaskCompleteAnimation,
    showBadgeUnlockAnimation,
    showLevelUpAnimation,
    clearAnimations
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

export default GamificationContext;
