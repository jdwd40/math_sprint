import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { saveScore } from '../lib/supabase';
import type { Operation } from '../types/game';

interface GameOverProps {
  score: number;
  operation: Operation;
}

export const GameOver: React.FC<GameOverProps> = ({ score, operation }) => {
  const navigate = useNavigate();
  const resetGame = useGameStore(state => state.resetGame);
  // Use useRef to persist across renders instead of useState
  const scoreHasBeenSaved = useRef(false);

  useEffect(() => {
    const saveUserScore = async () => {
      // Only save the score if it's greater than 0 and hasn't been saved yet
      if (score > 0 && !scoreHasBeenSaved.current) {
        try {
          // Set the flag before the API call to prevent double submissions
          scoreHasBeenSaved.current = true;
          await saveScore(score, operation);
          console.log('Score saved successfully');
        } catch (error) {
          console.error('Failed to save score:', error);
          // Only reset the flag if there was an error and we want to retry
          // scoreHasBeenSaved.current = false;
        }
      }
    };
    
    saveUserScore();
  }, [score, operation]);

  const handleHomeClick = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center p-6 mt-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-8 max-w-md w-full text-center transition-colors duration-300"
      >
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-300">Game Over!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 capitalize transition-colors duration-300">
          {operation} Challenge Complete
        </p>

        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: [0.5, 1.2, 1] }}
          transition={{ duration: 0.5 }}
          className="bg-blue-50 dark:bg-blue-900 rounded-xl p-6 mb-8 transition-colors duration-300"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">Your Score</p>
          <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">{score}</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleHomeClick}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 text-white py-4 px-6 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
        >
          <Home className="w-5 h-5" />
          Return Home
        </motion.button>
      </motion.div>
    </div>
  );
};