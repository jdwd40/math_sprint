import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';

export const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  // Apply dark mode class to document when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <nav className="w-full py-4 px-4 md:px-8 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/images/logo.png" 
            alt="Math Sprint Logo" 
            className="w-16 h-16 md:w-24 md:h-24 object-contain" 
          />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
            Math Sprint
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden md:inline-block text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Welcome, {profile?.username}!
            </span>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-yellow-300 transition-colors duration-300"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.button>
          
          {user && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSignOut}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
};