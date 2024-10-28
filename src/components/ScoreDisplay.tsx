import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  scoreChange: number | null;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, scoreChange }) => {
  return (
    <div className="relative flex items-center gap-2">
      <Brain className="w-6 h-6 text-blue-600" />
      <motion.span
        key={score}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        className="text-2xl font-bold text-blue-600"
      >
        {score}
      </motion.span>
      <AnimatePresence>
        {scoreChange && (
          <motion.span
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0 }}
            className={`absolute -top-2 left-full ml-2 font-bold ${
              scoreChange > 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {scoreChange > 0 ? `+${scoreChange}` : scoreChange}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};