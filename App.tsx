
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from './services/firebase';
import type { FirebaseUser } from './types';
import PublicCalendarPage from './components/PublicCalendarPage';
import LoginPage from './components/LoginPage';
import TeacherDashboardPage from './components/TeacherDashboardPage';
import Header from './components/Header';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'public' | 'login' | 'dashboard'>('public');

  useEffect(() => {
    // This effect runs once on mount to check the user's auth state.
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setView('dashboard');
      } else if (view === 'dashboard') {
        // If user was on dashboard and logs out, go to public view
        setView('public');
      }
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setView('public');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const navigateToLogin = () => {
    setView('login');
  };

  const navigateToDashboard = () => {
    if(user) {
        setView('dashboard');
    } else {
        setView('login');
    }
  };

  const navigateToHome = () => {
    setView('public');
  };

  const renderContent = () => {
    if (loading) {
      return <div className="mt-20 flex justify-center items-center"><Spinner /></div>;
    }
    
    switch (view) {
      case 'login':
        return <LoginPage onLoginSuccess={() => setView('dashboard')} />;
      case 'dashboard':
        return user ? <TeacherDashboardPage user={user} /> : <LoginPage onLoginSuccess={() => setView('dashboard')} />;
      case 'public':
      default:
        return <PublicCalendarPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onNavigateToLogin={navigateToLogin}
        onNavigateToDashboard={navigateToDashboard}
        onNavigateToHome={navigateToHome}
      />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
