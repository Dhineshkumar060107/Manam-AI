import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { auth } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

function App() {
  const [page, setPage] = useState<'home' | 'login'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // When user logs out, reset to home page
        setPage('home');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const navigateToLogin = () => setPage('login');
  const navigateToHome = () => setPage('home');
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  if (user) {
    return <DashboardPage />;
  }
  
  switch(page) {
    case 'home':
      return <HomePage navigateToLogin={navigateToLogin} />;
    case 'login':
      return <LoginPage navigateToHome={navigateToHome} />;
    default:
      return <HomePage navigateToLogin={navigateToLogin} />;
  }
}

export default App;