import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
  scoreChange: number | null;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, scoreChange }) => {
  return (
    <div className="relative flex items-center gap-2">
      <img 
        src="/images/logo.png" 
        alt="Math Sprint Logo" 
        className="w-8 h-8 object-contain"
      />
      <motion.span
        key={score}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300"
      >
        {score}
      </motion.span>
      <AnimatePresence>
        {scoreChange && (
          <motion.span
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0 }}
            className={`absolute -top-2 left-full ml-2 font-bold transition-colors duration-300 ${
              scoreChange > 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
            }`}
          >
            {scoreChange > 0 ? `+${scoreChange}` : scoreChange}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};