import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (score > 0) {
      saveScore(score, operation);
    }
  }, [score, operation]);

  const handleHomeClick = () => {
    resetGame();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
      >
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Over!</h2>
        <p className="text-gray-600 mb-6 capitalize">
          {operation} Challenge Complete
        </p>

        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: [0.5, 1.2, 1] }}
          transition={{ duration: 0.5 }}
          className="bg-blue-50 rounded-xl p-6 mb-8"
        >
          <p className="text-gray-600 mb-2">Your Score</p>
          <p className="text-5xl font-bold text-blue-600">{score}</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleHomeClick}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
        >
          <Home className="w-5 h-5" />
          Return Home
        </motion.button>
      </motion.div>
    </div>
  );
};