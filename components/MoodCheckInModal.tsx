import React, { useState } from 'react';
import { Mood } from '../types';

interface MoodCheckInModalProps {
  onClose: () => void;
  onAddEntry: (notes: string, mood?: Mood) => Promise<void>;
  isLoading: boolean;
}

const moodOptions = [
    { mood: Mood.Happy, emoji: '😊' },
    { mood: Mood.Calm, emoji: '😌' },
    { mood: Mood.Excited, emoji: '🤩' },
    { mood: Mood.Neutral, emoji: '😐' },
    { mood: Mood.Anxious, emoji: '😟' },
    { mood: Mood.Sad, emoji: '😢' },
    { mood: Mood.Stressed, emoji: '😫' },
];

export const MoodCheckInModal: React.FC<MoodCheckInModalProps> = ({ onClose, onAddEntry, isLoading }) => {
  const [notes, setNotes] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notes.trim() || selectedMood) {
      onAddEntry(notes, selectedMood);
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        style={{ animationFillMode: 'forwards' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">How are you feeling?</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select a mood (optional)</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 text-center">
                    {moodOptions.map(({ mood, emoji }) => (
                        <button
                            type="button"
                            key={mood}
                            onClick={() => setSelectedMood(mood)}
                            className={`p-2 rounded-lg text-3xl transition-all duration-200 ${selectedMood === mood ? 'bg-blue-600 scale-110' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                    Add some notes
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What's on your mind? The AI will analyze this to determine your mood if you don't select one."
                    className="w-full h-28 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows={4}
                />
            </div>
            
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading || (!notes.trim() && !selectedMood)}
                    className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : 'Log Mood'}
                </button>
            </div>
        </form>
        <style>{`
          @keyframes fade-in-scale {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-fade-in-scale {
            animation: fade-in-scale 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
          }
        `}</style>
      </div>
    </div>
  );
};