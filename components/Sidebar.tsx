
import React from 'react';
import { type AppView } from '../types';

interface SidebarProps {
  onOpenCheckIn: () => void;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

interface NavItemProps {
    icon: string;
    label: AppView;
    active: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
    >
        <span className="text-2xl">{icon}</span>
        <span className="font-semibold">{label}</span>
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCheckIn, activeView, onViewChange, isOpen, onClose, onLogout }) => {
  return (
    <>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/60 z-30 lg:hidden"></div>}
      <aside className={`w-64 bg-gray-800 p-6 flex-shrink-0 flex flex-col justify-between fixed top-0 left-0 h-screen z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white lg:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div>
          <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">M</span>
              </div>
              <h1 className="text-2xl font-bold text-white">MANAM</h1>
          </div>
          
          <button 
            onClick={onOpenCheckIn}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 mb-6 text-left flex items-center space-x-3"
          >
              <span className="text-2xl">+</span>
              <span>Quick Check-in</span>
          </button>
          
          <nav className="space-y-2">
              <NavItem icon="📊" label="Progress Report" active={activeView === 'Progress Report'} onClick={() => onViewChange('Progress Report')} />
              <NavItem icon="📈" label="Mood Timeline" active={activeView === 'Mood Timeline'} onClick={() => onViewChange('Mood Timeline')} />
              <NavItem icon="🧠" label="Insights & Patterns" active={activeView === 'Insights & Patterns'} onClick={() => onViewChange('Insights & Patterns')} />
              <NavItem icon="🛠️" label="Coping Strategies" active={activeView === 'Coping Strategies'} onClick={() => onViewChange('Coping Strategies')} />
          </nav>
        </div>

        <div className="space-y-4">
          <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left text-gray-400 hover:bg-gray-700 hover:text-white"
          >
              <span className="text-2xl">🚪</span>
              <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};