import React from 'react';
import { type MoodEntry, Mood } from '../types';

interface StreakTrackerProps {
  moodEntries: MoodEntry[];
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({ moodEntries }) => {
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedEntries = [...moodEntries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const uniqueDays = new Map<string, MoodEntry>();
    sortedEntries.forEach(entry => {
        const day = entry.timestamp.toISOString().split('T')[0];
        if(!uniqueDays.has(day)) {
            uniqueDays.set(day, entry);
        }
    });

    const entriesByDay = Array.from(uniqueDays.values()).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());

    for (let i = 0; i < entriesByDay.length; i++) {
      const entryDate = new Date(entriesByDay[i].timestamp);
      entryDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex items-center space-x-4">
      <div className="text-5xl">🔥</div>
      <div>
        <h2 className="text-xl font-bold text-white">{streak}-Day Streak</h2>
        <p className="text-gray-400">You've logged your mood for {streak} days in a row. Keep it up!</p>
      </div>
    </div>
  );
};

