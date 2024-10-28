import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Trophy, Play, LogOut, Plus, Minus, X, Divide } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getLeaderboard } from '../lib/supabase';
import type { Operation } from '../types/game';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();
  const [topScores, setTopScores] = useState<any[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<Operation>('addition');

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

  const operationIcons = {
    addition: <Plus className="w-5 h-5" />,
    subtraction: <Minus className="w-5 h-5" />,
    multiplication: <X className="w-5 h-5" />,
    division: <Divide className="w-5 h-5" />,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Math Sprint</h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {profile?.username}!</span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        )}
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play</h2>
            <div className="space-y-3 text-gray-600">
              <p>🎯 Solve as many math problems as you can in 30 seconds</p>
              <p>✨ Each correct answer gives you 10 points</p>
              <p>❌ Wrong answers deduct 5 points</p>
              <p>🏆 Compete for the top spot on the leaderboard</p>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlay}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg"
          >
            <Play className="w-6 h-6" />
            {user ? 'Play Now' : 'Sign In to Play'}
          </motion.button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
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
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {operationIcons[op]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {topScores.length > 0 ? (
              topScores.map((score, index) => (
                <motion.div
                  key={score.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-semibold text-gray-600">
                      #{index + 1}
                    </span>
                    <span className="font-medium">{score.profiles.username}</span>
                  </div>
                  <span className="font-bold text-blue-600">{score.score}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500">No scores yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};