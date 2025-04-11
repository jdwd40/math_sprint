import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { Keypad } from './Keypad';
import { Timer, Plus, Minus, X, Divide, LogOut, TrendingUp } from 'lucide-react';
import { Toast } from './Toast';
import { GameOver } from './GameOver';
import { ScoreDisplay } from './ScoreDisplay';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Operation } from '../types/game';

const operationSymbols = {
  addition: <Plus className="w-6 h-6" />,
  subtraction: <Minus className="w-6 h-6" />,
  multiplication: <X className="w-6 h-6" />,
  division: <Divide className="w-6 h-6" />,
};

// Map of difficulty levels to descriptions
const difficultyDescriptions = {
  0: 'Single-digit numbers (1-10)',
  1: 'Double-digit numbers (11-50)',
  2: 'Double-digit numbers (51-100)',
  3: 'Triple-digit numbers (101-200)',
  4: 'Triple-digit numbers (201-300)',
  5: 'Triple-digit numbers (301-500)',
  6: 'Triple-digit numbers (501-750)',
  7: 'Triple-digit numbers (751-999)',
  8: 'Four-digit numbers (1000-2000)',
  9: 'Four-digit numbers (2001-5000)',
  10: 'Extreme numbers (5001+)'
};

// Helper function to get points based on difficulty level
const getPointsForLevel = (level: number): number => {
  // Level 1 (index 0): 10 points
  // For levels 2-10 (index 1-9): Add 5 points per level (15, 20, 25, etc.)
  if (level === 0) return 10;
  if (level >= 1 && level <= 9) return 10 + (level * 5);
  // Beyond level 10, cap at 60 points
  return 60;
};

const getDifficultyProgress = (consecutiveCorrect: number) => {
  const nextThreshold = 5;
  return (consecutiveCorrect % nextThreshold) / nextThreshold * 100;
};

const OperationSelect: React.FC<{ onSelect: (op: Operation) => void }> = ({ onSelect }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-6 mt-8">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center transition-colors duration-300">Choose Operation</h1>
        <div className="grid grid-cols-2 gap-4">
          {(Object.entries(operationSymbols) as [Operation, JSX.Element][]).map(([op, symbol]) => (
            <motion.button
              key={op}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(op)}
              className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-6 px-4 rounded-xl shadow-sm transition-colors duration-300"
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

// Animated feedback component for score and time changes
const FeedbackAnimation: React.FC<{ 
  value: number | null; 
  type: 'score' | 'time';
}> = ({ value, type }) => {
  if (!value) return null;
  
  const isPositive = value > 0;
  const textColor = isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
  const prefix = isPositive ? '+' : '';
  const text = `${prefix}${value} ${type === 'time' ? 'sec' : ''}`;
  
  return (
    <AnimatePresence>
      <motion.div
        key={Date.now()}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: -30 }}
        exit={{ opacity: 0 }}
        className={`absolute ${textColor} font-bold text-xl transition-colors duration-300`}
      >
        {text}
      </motion.div>
    </AnimatePresence>
  );
};

// Level Up animation component
const LevelUpAnimation: React.FC<{ level: number; show: boolean }> = ({ level, show }) => {
  if (!show) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-center shadow-2xl"
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ 
            scale: [0.5, 1.2, 1],
            rotate: [-10, 5, 0]
          }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl font-bold text-white mb-2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: 2, duration: 0.5 }}
          >
            LEVEL UP!
          </motion.h2>
          <h3 className="text-2xl font-semibold text-white">
            Level {level + 1}
          </h3>
          <p className="text-yellow-200 mt-2">
            {difficultyDescriptions[level as keyof typeof difficultyDescriptions]}
          </p>
          <p className="text-yellow-200 mt-1 font-semibold">
            Points per question: {getPointsForLevel(level)}!
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const GameBoard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentProblem, 
    score, 
    timeLeft, 
    operation, 
    isPlaying, 
    isGameOver, 
    difficultyLevel,
    lastScoreChange,
    timeBonus,
    consecutiveCorrect,
    showLevelUpAnimation,
    submitAnswer, 
    startGame, 
    resetGame 
  } = useGameStore();
  
  const { profile } = useAuthStore();
  const [input, setInput] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => useGameStore.getState().tick(), 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

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
      const pointsValue = isCorrect ? getPointsForLevel(difficultyLevel) : -5;
      
      // Show animations based on answer correctness
      if (isCorrect) {
        setShowCorrect(true);
        setTimeout(() => setShowCorrect(false), 800);
      } else {
        setShowIncorrect(true);
        setTimeout(() => setShowIncorrect(false), 800);
      }
      
      // Show toast message
      setToast({
        message: isCorrect ? 
          `Correct! +${pointsValue} points, +5 seconds` : 
          'Wrong! -5 points',
        type: isCorrect ? 'success' : 'error',
      });
      
      // Clear the toast after a delay
      setTimeout(() => setToast(null), 1500);
      
      // Clear the input field
      setInput('');
    }
  };

  // Calculate progress towards next level
  const progressPercentage = getDifficultyProgress(consecutiveCorrect);

  // Get current points per question for display
  const currentPointsValue = getPointsForLevel(difficultyLevel);

  return (
    <div className="flex flex-col items-center justify-between p-6 mt-4 sm:mt-8">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4 sm:mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <ScoreDisplay score={score} scoreChange={lastScoreChange} />
              <div className="absolute top-0 left-full">
                <FeedbackAnimation value={lastScoreChange} type="score" />
              </div>
            </div>
            <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">|</span>
            <span className="text-gray-800 dark:text-gray-200 font-medium transition-colors duration-300">{profile?.username}</span>
          </div>
          <div className="relative flex items-center gap-2">
            <Timer className="w-6 h-6 text-red-600 dark:text-red-400 transition-colors duration-300" />
            <motion.span
              key={timeLeft}
              animate={{ scale: timeLeft <= 5 ? [1, 1.2, 1] : 1 }}
              className={`text-2xl font-bold transition-colors duration-300 ${
                timeLeft <= 5 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {timeLeft}s
            </motion.span>
            <div className="absolute top-0 left-full">
              <FeedbackAnimation value={timeBonus} type="time" />
            </div>
          </div>
        </div>

        {/* Enhanced difficulty level indicator with progress bar */}
        <div className="mb-4 space-y-1">
          <div className="flex justify-between items-center text-blue-600 dark:text-blue-400 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                Level {difficultyLevel + 1}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {consecutiveCorrect % 5}/5 to next level
            </span>
          </div>
          
          {/* Progress bar to next level */}
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-all duration-300">
            <motion.div 
              className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-300"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
          
          {/* Difficulty description with points per question */}
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
              {difficultyDescriptions[difficultyLevel as keyof typeof difficultyDescriptions]}
            </p>
            <p className="text-xs font-medium text-green-600 dark:text-green-400 transition-colors duration-300">
              +{currentPointsValue} pts per correct answer
            </p>
          </div>
        </div>

        <motion.div
          key={currentProblem.answer}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-6 relative transition-colors duration-300
            ${showCorrect ? 'ring-4 ring-green-400' : ''} 
            ${showIncorrect ? 'ring-4 ring-red-400' : ''}`}
        >
          {/* Answer feedback overlay */}
          <AnimatePresence>
            {showCorrect && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center transition-colors duration-300"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1.2, rotate: [0, 10, 0, -10, 0] }}
                  exit={{ scale: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <motion.span
                    className="text-5xl text-green-600 dark:text-green-300 mb-2"
                    animate={{ rotate: [0, 15, 0, -15, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    ✓
                  </motion.span>
                  <motion.span
                    className="text-3xl font-bold text-green-600 dark:text-green-300 transition-colors duration-300"
                  >
                    Correct!
                  </motion.span>
                </motion.div>
              </motion.div>
            )}
            
            {showIncorrect && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-red-100 dark:bg-red-900 rounded-2xl flex items-center justify-center transition-colors duration-300"
              >
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1.2, rotate: [0, 5, 0, -5, 0] }}
                  exit={{ scale: 0.5 }}
                  className="text-3xl font-bold text-red-600 dark:text-red-300 transition-colors duration-300"
                >
                  Incorrect!
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center items-center text-3xl sm:text-4xl font-bold mb-3 sm:mb-6">
            <span className="text-gray-800 dark:text-white transition-colors duration-300">{currentProblem.num1}</span>
            <span className="mx-4 text-gray-800 dark:text-white transition-colors duration-300">{operationSymbols[operation]}</span>
            <span className="text-gray-800 dark:text-white transition-colors duration-300">{currentProblem.num2}</span>
            <span className="mx-4 text-gray-800 dark:text-white transition-colors duration-300">=</span>
            <motion.span
              key={input}
              initial={{ scale: 1 }}
              animate={{ scale: input ? [1, 1.1, 1] : 1 }}
              className="w-24 text-center text-gray-800 dark:text-white transition-colors duration-300"
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

      {/* Level Up Animation */}
      <LevelUpAnimation level={difficultyLevel} show={showLevelUpAnimation} />

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