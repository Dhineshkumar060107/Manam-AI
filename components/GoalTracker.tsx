import React, { useState } from 'react';
import { type Goal } from '../types';

const initialGoals: Goal[] = [
  { id: '1', text: 'Practice meditation daily', completed: false, targetCount: 7, currentCount: 4 },
  { id: '2', text: 'Journal 3 times this week', completed: false, targetCount: 3, currentCount: 2 },
  { id: '3', text: 'Stay calm for 5 days', completed: true, targetCount: 5, currentCount: 5 },
];

export const GoalTracker: React.FC = () => {
  const [goals] = useState<Goal[]>(initialGoals);

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Goal Setting & Tracking</h2>
      <ul className="space-y-4">
        {goals.map(goal => (
          <li key={goal.id}>
            <div className="flex justify-between items-center mb-1">
              <span className={`text-sm ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                {goal.text}
              </span>
              <span className={`text-sm font-medium ${goal.completed ? 'text-green-400' : 'text-gray-400'}`}>
                {goal.currentCount}/{goal.targetCount}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${goal.completed ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${(goal.currentCount / goal.targetCount) * 100}%` }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};