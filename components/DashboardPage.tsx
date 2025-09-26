import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { MoodCheckInModal } from './MoodCheckInModal';
import { ManamAIChat } from './ManamAIChat';
import { ChatbotFab } from './ChatbotFab';
import { type MoodEntry, Mood, type AppView } from '../types';
import { analyzeMoodFromText } from '../services/geminiService';
import { MoodTimeline } from './MoodTimeline';
import { AIPatterns } from './AIPatterns';
import { CopingStrategies } from './CopingStrategies';
import { auth, moodService } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

export const DashboardPage: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMoodLoading, setIsMoodLoading] = useState(false);
  const [activeView, setActiveView] = useState<AppView>('Progress Report');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // A little welcome animation for the FAB
    const timer = setTimeout(() => {
      const fab = document.getElementById('chatbot-fab');
      if (fab) {
        fab.classList.remove('opacity-0', 'translate-y-4');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Listen to mood entries from Firebase
  useEffect(() => {
    if (user) {
      const unsubscribe = moodService.listenToMoodEntries(user.uid, (entries) => {
        setMoodEntries(entries);
      });

      return () => unsubscribe();
    }
  }, [user]);
  
  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error("Logout failed:", error);
    });
  };

  const handleAddEntry = async (notes: string, mood?: Mood) => {
    if (!user) return;
    
    setIsMoodLoading(true);
    let finalMood: Mood;

    try {
      if (mood) {
          finalMood = mood;
      } else if (notes.trim()) {
          const analyzedMood = await analyzeMoodFromText(notes);
          finalMood = analyzedMood as Mood; // Assuming service returns a valid Mood enum string
      } else {
          // Should not happen due to button disable logic, but as a fallback
          setIsMoodLoading(false);
          return;
      }

      const newEntry = {
          mood: finalMood,
          notes,
          timestamp: new Date(),
      };

      // Save to Firebase - the listener will automatically update the local state
      await moodService.addMoodEntry(user.uid, newEntry);
      
      setIsMoodLoading(false);
      setIsCheckInModalOpen(false);
    } catch (error) {
      console.error('Error adding mood entry:', error);
      setIsMoodLoading(false);
    }
  };
  
  const renderActiveView = () => {
    switch (activeView) {
      case 'Progress Report':
        return <Dashboard moodEntries={moodEntries} />;
      case 'Mood Timeline':
        return <MoodTimeline moodEntries={moodEntries} />;
      case 'Insights & Patterns':
        return <AIPatterns moodEntries={moodEntries} />;
      case 'Coping Strategies':
        return <CopingStrategies />;
      default:
        return <Dashboard moodEntries={moodEntries} />;
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 font-sans">
      <Sidebar 
        onOpenCheckIn={() => {
          setIsCheckInModalOpen(true);
          setIsSidebarOpen(false);
        }}
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <header className="lg:hidden bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-700">
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-300 hover:text-white p-2 -ml-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-md font-bold text-white">M</span>
                </div>
                <h1 className="text-xl font-bold text-white">MANAM</h1>
            </div>
            <div className="w-8"></div>
        </header>
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>


      {isCheckInModalOpen && (
        <MoodCheckInModal
          onClose={() => setIsCheckInModalOpen(false)}
          onAddEntry={handleAddEntry}
          isLoading={isMoodLoading}
        />
      )}

      <div id="chatbot-fab" className="opacity-0 translate-y-4 transition-all duration-500 ease-out">
        {!isChatOpen && <ChatbotFab onOpen={() => setIsChatOpen(true)} />}
      </div>
      
      {isChatOpen && (
         <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsChatOpen(false)}
        >
            <div 
                className="bg-transparent w-full max-w-2xl h-[80vh] max-h-[800px] transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                style={{ animationFillMode: 'forwards' }}
                onClick={(e) => e.stopPropagation()}
            >
                <ManamAIChat onClose={() => setIsChatOpen(false)} />
            </div>
        </div>
      )}
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
  );
};
