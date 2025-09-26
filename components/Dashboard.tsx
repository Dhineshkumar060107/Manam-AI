
import React from 'react';
import { type MoodEntry } from '../types';
import { MoodDistribution } from './MoodDistribution';
import { StreakTracker } from './StreakTracker';
import { WeeklySummary } from './WeeklySummary';
import { GoalTracker } from './GoalTracker';

interface DashboardProps {
  moodEntries: MoodEntry[];
}

export const Dashboard: React.FC<DashboardProps> = ({ moodEntries }) => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Progress Report</h1>
        <p className="text-lg text-gray-400">Here's a glance at your recent activity and wellness goals.</p>
      </header>
      
      <div className="space-y-8">
        <WeeklySummary moodEntries={moodEntries} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MoodDistribution moodEntries={moodEntries} />
          </div>
          
          <div className="space-y-8">
            <StreakTracker moodEntries={moodEntries} />
            <GoalTracker />
          </div>
        </div>
      </div>
    </div>
  );
};
