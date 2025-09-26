
import React, { useState, useMemo } from 'react';
import { type MoodEntry, Mood } from '../types';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from 'recharts';

interface MoodTimelineProps {
  moodEntries: MoodEntry[];
}

const moodColors: { [key in Mood]: string } = {
  [Mood.Happy]: '#4ade80',
  [Mood.Excited]: '#2dd4bf',
  [Mood.Calm]: '#60a5fa',
  [Mood.Neutral]: '#9ca3af',
  [Mood.Sad]: '#a78bfa',
  [Mood.Anxious]: '#facc15',
  [Mood.Stressed]: '#f87171',
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const moodData = payload.find(p => p.value === 1);

    if (!moodData) {
      return (
        <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 shadow-lg">
          <p className="label font-bold text-white">{`${label}`}</p>
          <p className="intro text-gray-400">No mood logged</p>
        </div>
      );
    }

    const moodName = moodData.name as Mood;
    return (
      <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 shadow-lg">
        <p className="label font-bold text-white">{`${label}`}</p>
        <p className="intro" style={{ color: moodColors[moodName] }}>{`Mood: ${moodName}`}</p>
      </div>
    );
  }
  return null;
};

// Helper to get a stable YYYY-MM-DD key regardless of timezone
const toLocalDateKey = (date: Date): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const MoodTimeline: React.FC<MoodTimelineProps> = ({ moodEntries }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('month');

  const chartData = useMemo(() => {
    const now = new Date();
    
    const getBarData = (days: number) => {
        const fromDate = new Date();
        fromDate.setDate(now.getDate() - (days - 1));
        fromDate.setHours(0, 0, 0, 0);

        // Create a map of the most recent mood entry for each day
        const moodMap = new Map<string, Mood>();
        moodEntries
            .filter(entry => new Date(entry.timestamp) >= fromDate)
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) // Sort to ensure the last entry of the day is used
            .forEach(entry => {
                const dayKey = toLocalDateKey(entry.timestamp);
                moodMap.set(dayKey, entry.mood);
            });

        const data = [];
        // Generate a data point for every day in the range
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            
            const dayKey = toLocalDateKey(date);
            const mood = moodMap.get(dayKey);

            // Fix: A mapped type cannot be declared with other properties. Use an intersection type instead.
            const dataPoint: { date: string } & { [key in Mood]?: number } = {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                ...Object.fromEntries(Object.values(Mood).map(m => [m, 0])),
            };

            if (mood) {
                dataPoint[mood] = 1; // Set the value for the logged mood
            }
            
            data.push(dataPoint);
        }
        return data;
    };
    
    return { 
        week: getBarData(7), 
        month: getBarData(30) 
    };
  }, [moodEntries]);
  
  const dataToDisplay = chartData[timeRange];
  const xAxisInterval = timeRange === 'month' ? 6 : 0; // Adjust label frequency for readability
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Mood Timeline</h1>
        <p className="text-lg text-gray-400">An interactive history of your mood entries.</p>
      </header>
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {timeRange === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
          </h2>
          <div className="flex space-x-2 bg-gray-700 p-1 rounded-lg">
            <button onClick={() => setTimeRange('week')} className={`px-3 py-1 text-sm rounded-md ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}>Week</button>
            <button onClick={() => setTimeRange('month')} className={`px-3 py-1 text-sm rounded-md ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}>Month</button>
          </div>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          {dataToDisplay.length > 0 ? (
            <ResponsiveContainer>
                <BarChart data={dataToDisplay} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="date" tick={{ fill: '#a0aec0' }} fontSize={12} interval={xAxisInterval} />
                    <YAxis hide={true} domain={[0, 1]} />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(107, 114, 128, 0.2)' }} />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}}/>
                    {Object.values(Mood).map(mood => (
                        <Bar key={mood} dataKey={mood} stackId="a" fill={moodColors[mood]} name={mood} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>No data for this period.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
