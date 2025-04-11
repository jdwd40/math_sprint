import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../lib/supabase';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';

interface LeaderboardProps {
  onPlayAgain: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onPlayAgain }) => {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const operation = useGameStore(state => state.operation);
  const currentScore = useGameStore(state => state.score);
  const { signOut } = useAuthStore();

  useEffect(() => {
    const loadScores = async () => {
      const data = await getLeaderboard(operation);
      setScores(data || []);
      setLoading(false);
    };
    loadScores();
  }, [operation]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Leaderboard</h2>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="mb-4 text-center">
            <p className="text-lg text-gray-600">Your Score</p>
            <p className="text-3xl font-bold text-blue-600">{currentScore}</p>
          </div>

          <div className="space-y-3">
            {scores.map((score, index) => (
              <div
                key={score.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  score.score === currentScore ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-600">#{index + 1}</span>
                  <span className="font-medium">{score.profiles.username}</span>
                </div>
                <span className="font-bold text-blue-600">{score.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onPlayAgain}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={signOut}
            className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};