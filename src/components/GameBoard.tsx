import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { Keypad } from './Keypad';
import { Timer, Plus, Minus, X, Divide, LogOut } from 'lucide-react';
import { Toast } from './Toast';
import { GameOver } from './GameOver';
import { ScoreDisplay } from './ScoreDisplay';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Operation } from '../types/game';

const operationSymbols = {
  addition: <Plus className="w-6 h-6" />,
  subtraction: <Minus className="w-6 h-6" />,
  multiplication: <X className="w-6 h-6" />,
  division: <Divide className="w-6 h-6" />,
};

const OperationSelect: React.FC<{ onSelect: (op: Operation) => void }> = ({ onSelect }) => {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <span className="text-gray-800 font-medium">Welcome, {profile?.username}!</span>
          <button
            onClick={handleSignOut}
            className="text-gray-600 hover:text-gray-800"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Choose Operation</h1>
        <div className="grid grid-cols-2 gap-4">
          {(Object.entries(operationSymbols) as [Operation, JSX.Element][]).map(([op, symbol]) => (
            <motion.button
              key={op}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(op)}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-6 px-4 rounded-xl shadow-sm transition-colors"
            >
              {symbol}
              <span className="capitalize">{op}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const GameBoard: React.FC = () => {
  const navigate = useNavigate();
  const { currentProblem, score, timeLeft, operation, isPlaying, isGameOver, submitAnswer, startGame, resetGame } = useGameStore();
  const { profile, signOut } = useAuthStore();
  const [input, setInput] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [scoreChange, setScoreChange] = useState<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => useGameStore.getState().tick(), 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  const handleSignOut = () => {
    resetGame();
    signOut();
    navigate('/');
  };

  const handleOperationSelect = (selectedOperation: Operation) => {
    startGame(selectedOperation);
  };

  if (isGameOver) {
    return <GameOver score={score} operation={operation} />;
  }

  if (!isPlaying) {
    return <OperationSelect onSelect={handleOperationSelect} />;
  }

  const handleSubmit = () => {
    if (input) {
      const isCorrect = submitAnswer(input);
      setToast({
        message: isCorrect ? 'Correct! +10 points' : 'Wrong! -5 points',
        type: isCorrect ? 'success' : 'error',
      });
      setScoreChange(isCorrect ? 10 : -5);
      setTimeout(() => setScoreChange(null), 1000);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <ScoreDisplay score={score} scoreChange={scoreChange} />
            <span className="text-gray-600">|</span>
            <span className="text-gray-800 font-medium">{profile?.username}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="w-6 h-6 text-red-600" />
              <motion.span
                key={timeLeft}
                animate={{ scale: timeLeft <= 5 ? [1, 1.2, 1] : 1 }}
                className={`text-2xl font-bold ${
                  timeLeft <= 5 ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                {timeLeft}s
              </motion.span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-800"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <motion.div
          key={currentProblem.answer}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex justify-center items-center text-4xl font-bold mb-8">
            <span>{currentProblem.num1}</span>
            <span className="mx-4">{operationSymbols[operation]}</span>
            <span>{currentProblem.num2}</span>
            <span className="mx-4">=</span>
            <motion.span
              key={input}
              initial={{ scale: 1 }}
              animate={{ scale: input ? [1, 1.1, 1] : 1 }}
              className="w-24 text-center"
            >
              {input || '_'}
            </motion.span>
          </div>
        </motion.div>

        <Keypad
          onNumberClick={(num) => setInput(prev => prev + num)}
          onSubmit={handleSubmit}
          onClear={() => setInput('')}
        />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
};