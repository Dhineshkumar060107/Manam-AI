import React, { useState, useCallback, useEffect } from 'react';
import { type MoodEntry, type AIPattern } from '../types';
import { identifyPatterns } from '../services/geminiService';

interface AIPatternsProps {
  moodEntries: MoodEntry[];
}

const PatternCard: React.FC<{ pattern: AIPattern }> = ({ pattern }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg">
        <p className="font-semibold text-blue-300 mb-1">{pattern.pattern}</p>
        <p className="text-gray-300 text-sm">{pattern.suggestion}</p>
    </div>
);

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        <div className="bg-gray-700 h-16 rounded-lg"></div>
        <div className="bg-gray-700 h-16 rounded-lg"></div>
    </div>
);

export const AIPatterns: React.FC<AIPatternsProps> = ({ moodEntries }) => {
  const [patterns, setPatterns] = useState<AIPattern[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerateInsights = useCallback(async () => {
    setIsLoading(true);
    setHasGenerated(true);
    try {
      const result = await identifyPatterns(moodEntries);
      setPatterns(result);
    } catch (error) {
      console.error("Failed to generate insights:", error);
      setPatterns([{ pattern: 'Error', suggestion: 'Could not fetch insights. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [moodEntries]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Auto-generate insights on first load if there's enough data
    if (moodEntries.length >= 5 && !hasGenerated) {
        handleGenerateInsights();
    }
  }, [moodEntries, hasGenerated, handleGenerateInsights]);


  return (
    <div className="space-y-6">
       <header>
        <h1 className="text-3xl font-bold text-white">Insights & Patterns</h1>
        <p className="text-lg text-gray-400">Discover meaningful patterns and triggers with AI-powered analysis.</p>
      </header>
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-start mb-4">
              <div>
                  <h2 className="text-xl font-bold text-white">AI-Powered Insights</h2>
                  <p className="text-gray-400">Discover triggers and patterns in your mood.</p>
              </div>
              <button
                  onClick={handleGenerateInsights}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
                  >
                  {isLoading ? 'Analyzing...' : 'Refresh Insights'}
              </button>
          </div>

          {isLoading ? (
              <LoadingSkeleton />
          ) : hasGenerated && patterns.length > 0 ? (
              <div className="space-y-3">
                  {patterns.map((p, i) => <PatternCard key={i} pattern={p} />)}
              </div>
          ) : (
              <div className="text-center py-8 text-gray-500">
                  <p>Click "Refresh Insights" to discover patterns in your mood data.</p>
              </div>
          )}
      </div>
    </div>
  );
};