import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Play, Plus, Minus, X, Divide, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getLeaderboard, resetScores } from '../lib/supabase';
import type { Operation } from '../types/game';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();
  const [topScores, setTopScores] = useState<any[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<Operation>('addition');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedOperation]);

  const loadLeaderboard = async () => {
    const scores = await getLeaderboard(selectedOperation);
    setTopScores(scores?.slice(0, 5) || []);
  };

  const handlePlay = () => {
    if (user) {
      navigate('/play');
    } else {
      navigate('/auth');
    }
  };

  const handleResetScores = async () => {
    if (!user) return;
    setIsResetting(true);
    try {
      await resetScores();
      await loadLeaderboard();
    } catch (error) {
      console.error('Failed to reset scores:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const operationIcons = {
    addition: <Plus className="w-5 h-5" />,
    subtraction: <Minus className="w-5 h-5" />,
    multiplication: <X className="w-5 h-5" />,
    division: <Divide className="w-5 h-5" />,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">How to Play</h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300 transition-colors duration-300">
              <p>🎯 Solve as many math problems as you can in 30 seconds, you get 5 more seconds for every correct answer</p>
              <p>✨ Each correct answer gives you 10 points and 5 additional seconds</p>
              <p>❌ Wrong answers deduct 5 points</p>
              <p>🏆 Compete for the top spot on the leaderboard</p>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlay}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl transition-colors font-semibold text-lg dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Play className="w-6 h-6" />
            {user ? 'Play Now' : 'Sign In to Play'}
          </motion.button>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 transition-colors duration-300">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Top Scores
            </h2>
            <div className="flex gap-2">
              {(Object.keys(operationIcons) as Operation[]).map((op) => (
                <button
                  key={op}
                  onClick={() => setSelectedOperation(op)}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedOperation === op
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300'
                      : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                  }`}
                >
                  {operationIcons[op]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {topScores.length > 0 ? (
              topScores.map((score, index) => (
                <motion.div
                  key={score.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-600 transition-colors duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-300">
                      #{index + 1}
                    </span>
                    <span className="font-medium dark:text-white transition-colors duration-300">{score.profiles.username}</span>
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">{score.score}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">No scores yet</p>
            )}
          </div>

          {user && (
            <div className="flex justify-end">
              <button
                onClick={handleResetScores}
                disabled={isResetting}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 py-2 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-300"
              >
                <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                Reset My Scores
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};