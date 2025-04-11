import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Home } from './components/Home';
import { Auth } from './components/Auth';
import { GameBoard } from './components/GameBoard';
import { PrivateRoute } from './components/PrivateRoute';
import { Navbar } from './components/Navbar';
import { useThemeStore } from './store/themeStore';
import { LogoTroubleshooting } from './pages/LogoTroubleshooting';

function App() {
  const { isLoading, loadUser } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    loadUser();  // Load user on app start to ensure profile data is available
  }, [loadUser]);  // Adding `loadUser` to dependencies for future-proofing

  // Apply dark mode class when component mounts
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <Navbar />
        <main className="pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/play"
              element={
                <PrivateRoute>
                  <GameBoard />
                </PrivateRoute>
              }
            />
            <Route path="/logo-troubleshooting" element={<LogoTroubleshooting />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;