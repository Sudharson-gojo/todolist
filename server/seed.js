// Demo seed script for testing gamification features
const express = require('express');

// Simulate time for Early Bird demo
const simulateEarlyBirdCompletion = () => {
  const now = new Date();
  const earlyTime = new Date(now);
  earlyTime.setHours(7, 30, 0, 0); // 7:30 AM
  return earlyTime.toISOString();
};

// Simulate rollover for streak testing
const simulateRollover = () => {
  console.log('🔄 Simulating day rollover...');
  console.log('- Checking for missed deadlines');
  console.log('- Updating streaks');
  console.log('- Applying point penalties for overdue tasks');
  console.log('✅ Rollover complete');
};

// Demo functions for testing
const demoFunctions = {
  earlyBird: simulateEarlyBirdCompletion,
  rollover: simulateRollover
};

console.log('🎮 Gamification Demo Functions Available:');
console.log('- Early Bird completion time:', simulateEarlyBirdCompletion());
console.log('- Use /api/cron/rollover endpoint to simulate day rollover');

module.exports = demoFunctions;
