
import React, { useState, useCallback, useEffect } from 'react';
import { type MoodEntry } from '../types';
import { generateWeeklySummary } from '../services/geminiService';

interface WeeklySummaryProps {
  moodEntries: MoodEntry[];
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({ moodEntries }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateSummary = useCallback(async () => {
    setIsLoading(true);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEntries = moodEntries.filter(e => new Date(e.timestamp) > sevenDaysAgo);

    try {
      const result = await generateWeeklySummary(recentEntries);
      setSummary(result);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      setSummary('Could not fetch summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [moodEntries]);
  
  useEffect(() => {
    handleGenerateSummary();
  }, [handleGenerateSummary]); // Re-generate if mood entries change

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-white">AI Weekly Summary</h2>
        <button onClick={handleGenerateSummary} disabled={isLoading} className="text-blue-400 hover:text-blue-300 text-sm">
          {isLoading ? '...' : '🔄'}
        </button>
      </div>
      {isLoading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      ) : (
        <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
      )}
    </div>
  );
};
