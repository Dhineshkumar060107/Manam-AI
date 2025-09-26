import React, { useState, useMemo } from 'react';
import { type MoodEntry, Mood } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface MoodDistributionProps {
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

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = <T extends { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number; index: number; }>(props: T) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export const MoodDistribution: React.FC<MoodDistributionProps> = ({ moodEntries }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  const data = useMemo(() => {
    const now = new Date();
    const filteredEntries = moodEntries.filter(entry => {
      if (timeRange === 'all') return true;
      const entryDate = new Date(entry.timestamp);
      if (timeRange === 'week') {
        const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        return entryDate >= oneWeekAgo;
      }
      // 'month'
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return entryDate >= oneMonthAgo;
    });

    return Object.values(Mood).map(mood => {
        const count = filteredEntries.filter(entry => entry.mood === mood).length;
        return { name: mood, value: count };
    }).filter(d => d.value > 0);

  }, [moodEntries, timeRange]);

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Mood Distribution</h2>
        <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg">
          <button onClick={() => setTimeRange('week')} className={`px-3 py-1 text-sm rounded-md ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}>Week</button>
          <button onClick={() => setTimeRange('month')} className={`px-3 py-1 text-sm rounded-md ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}>Month</button>
          <button onClick={() => setTimeRange('all')} className={`px-3 py-1 text-sm rounded-md ${timeRange === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300'}`}>All</button>
        </div>
      </div>
      <div style={{ width: '100%', height: 250 }}>
        {data.length > 0 ? (
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    >
                    {data.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={moodColors[entry.name as Mood]} />
                    ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ 
                            backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                            borderColor: '#4b5563', 
                            borderRadius: '0.5rem' 
                        }}
                    />
                    <Legend iconType="circle" wrapperStyle={{fontSize: '14px', paddingTop: '10px'}}/>
                </PieChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>No data for this period.</p>
            </div>
        )}
      </div>
    </div>
  );
};