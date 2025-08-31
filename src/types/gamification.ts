export type Frequency = 'daily' | 'weekly' | 'monthly';

export type Task = {
  id: string;
  userId: string;
  title: string;
  frequency: Frequency;
  assignedFor: string; // ISO date of the day/week-start/month-start
  completedAt?: string; // ISO timestamp
  createdAt: string;
};

export type BadgeId = 'earlyBird' | 'consistencyKing' | 'weeklyChampion';

export type Badge = {
  id: BadgeId;
  name: string;
  description: string;
  earnedAt: string;
};

export type UserProgress = {
  userId: string;
  points: number;
  level: number;
  xp: number; // current level XP
  badges: Badge[];
  streaks: {
    daily: number;
    bestDaily: number;
  };
  // derived stats for UI
  progress: {
    dailyPct: number;
    weeklyPct: number;
    monthlyPct: number;
    overallPct: number;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  progress: UserProgress;
};

export type CalendarDay = {
  date: string;
  assignments: {
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  completions: {
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  isStreakDay: boolean;
};

export type CompletionResult = {
  task: Task;
  progress: UserProgress;
  levelUp?: boolean;
  newBadges?: Badge[];
  pointsEarned: number;
};
