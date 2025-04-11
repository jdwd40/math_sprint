import { create } from 'zustand';
import { Operation, GameState, Problem } from '../types/game';
import { persist } from 'zustand/middleware';

// Generate number ranges for each difficulty level
const getDifficultyRange = (level: number): { min: number; max: number } => {
  switch (level) {
    case 0: return { min: 1, max: 10 }; // Level 1: Single-digit (1-10)
    case 1: return { min: 11, max: 50 }; // Level 2: Double-digit (11-50)
    case 2: return { min: 51, max: 100 }; // Level 3: Double-digit (51-100)
    case 3: return { min: 101, max: 200 }; // Level 4: Triple-digit (101-200)
    case 4: return { min: 201, max: 300 }; // Level 5: Triple-digit (201-300)
    case 5: return { min: 301, max: 500 }; // Level 6: Triple-digit (301-500)
    case 6: return { min: 501, max: 750 }; // Level 7: Triple-digit (501-750)
    case 7: return { min: 751, max: 999 }; // Level 8: Triple-digit (751-999)
    case 8: return { min: 1000, max: 2000 }; // Level 9: Four-digit (1000-2000)
    case 9: return { min: 2001, max: 5000 }; // Level 10: Four-digit (2001-5000)
    default: return { min: 5001, max: 9999 }; // Beyond level 10
  }
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

const generateProblem = (operation: Operation, difficultyLevel: number): Problem => {
  let num1: number, num2: number, answer: number;
  
  // Get number range based on current difficulty level
  const { min, max } = getDifficultyRange(difficultyLevel);
  
  if (operation === 'multiplication' || operation === 'division') {
    // For multiplication/division, use smaller factors that fit the difficulty level
    const factorMax = Math.min(max, 20 + difficultyLevel * 5); // Cap multiplication factors
    const factorMin = Math.max(min, 2); // Ensure at least 2 for multiplication
    
    num1 = Math.floor(Math.random() * (factorMax - factorMin + 1)) + factorMin;
    num2 = Math.floor(Math.random() * (factorMax - factorMin + 1)) + factorMin;
  } else {
    // For addition/subtraction, use the full range
    num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  switch (operation) {
    case 'addition':
      answer = num1 + num2;
      break;
    case 'subtraction':
      // Ensure num1 is always larger for subtraction to avoid negative answers
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      answer = num1 - num2;
      break;
    case 'multiplication':
      answer = num1 * num2;
      break;
    case 'division':
      // Ensure division problems have integer answers
      answer = num1;
      num1 = num1 * num2;
      break;
    default:
      answer = 0;
  }

  return { num1, num2, answer, userAnswer: '' };
};

export const useGameStore = create<GameState & {
  startGame: (operation: Operation) => void;
  submitAnswer: (answer: string) => boolean;
  endGame: () => void;
  tick: () => void;
  resetGame: () => void;
}>()(
  persist(
    (set, get) => ({
      score: 0,
      timeLeft: 30,
      operation: 'addition',
      currentProblem: generateProblem('addition', 0),
      isPlaying: false,
      isGameOver: false,
      lastScoreChange: null,
      difficultyLevel: 0,
      consecutiveCorrect: 0,
      timeBonus: null,
      showLevelUpAnimation: false,

      startGame: (operation) => {
        // Get saved difficulty level or start at 0
        const savedState = JSON.parse(localStorage.getItem('game-progress') || '{}');
        const savedLevel = savedState[operation] || 0;
        
        set({
          operation,
          score: 0,
          timeLeft: 30,
          isPlaying: true,
          isGameOver: false,
          currentProblem: generateProblem(operation, savedLevel),
          lastScoreChange: null,
          difficultyLevel: savedLevel,
          consecutiveCorrect: 0,
          timeBonus: null,
          showLevelUpAnimation: false,
        });
      },

      submitAnswer: (answer) => {
        const { currentProblem, score, operation, difficultyLevel, consecutiveCorrect, timeLeft } = get();
        const isCorrect = parseInt(answer) === currentProblem.answer;
        
        if (isCorrect) {
          // Get points based on current difficulty level
          const pointsEarned = getPointsForLevel(difficultyLevel);
          
          // Calculate new score and consecutive correct answers
          const newScore = score + pointsEarned;
          const newConsecutiveCorrect = consecutiveCorrect + 1;
          
          // Check if we should increase difficulty level (every 5 correct answers)
          const levelUpThreshold = 5;
          // Calculate new level based on consecutive correct answers
          const newDifficultyLevel = Math.min(9, Math.floor(newConsecutiveCorrect / levelUpThreshold));
          const difficultyIncreased = newDifficultyLevel > difficultyLevel;
          
          // Add 5 seconds for each correct answer
          const timeBonus = 5;
          const newTimeLeft = Math.min(timeLeft + timeBonus, 99); // Cap at 99 seconds
          
          // Save progress to localStorage if level increased
          if (difficultyIncreased) {
            const savedProgress = JSON.parse(localStorage.getItem('game-progress') || '{}');
            savedProgress[operation] = newDifficultyLevel;
            localStorage.setItem('game-progress', JSON.stringify(savedProgress));
          }
          
          // Update game state
          set({
            score: newScore,
            consecutiveCorrect: newConsecutiveCorrect,
            difficultyLevel: newDifficultyLevel,
            currentProblem: generateProblem(operation, newDifficultyLevel),
            lastScoreChange: pointsEarned,
            timeLeft: newTimeLeft,
            timeBonus: timeBonus,
            showLevelUpAnimation: difficultyIncreased,
          });
          
          // Reset level up animation after a delay
          if (difficultyIncreased) {
            setTimeout(() => {
              set({ showLevelUpAnimation: false });
            }, 2000);
          }
        } else {
          // Incorrect answer
          const scoreDeduction = 5;
          const newScore = Math.max(0, score - scoreDeduction);
          
          // Reset consecutive correct counter but KEEP the current difficulty level
          // This is the key fix - we explicitly keep the same difficultyLevel when updating state
          set({
            score: newScore,
            consecutiveCorrect: 0,  // Reset consecutive correct answers
            difficultyLevel: difficultyLevel,  // Explicitly keep current difficulty level
            currentProblem: generateProblem(operation, difficultyLevel),
            lastScoreChange: -scoreDeduction,
            timeBonus: null,
          });
        }
        
        // Small delay to reset the feedback indicators
        setTimeout(() => {
          set({
            lastScoreChange: null,
            timeBonus: null,
          });
        }, 1500);
        
        return isCorrect;
      },

      endGame: () => {
        set({ isPlaying: false, isGameOver: true });
      },

      resetGame: () => {
        set({
          score: 0,
          timeLeft: 30,
          isPlaying: false,
          isGameOver: false,
          lastScoreChange: null,
          difficultyLevel: 0,
          consecutiveCorrect: 0,
          timeBonus: null,
          showLevelUpAnimation: false,
        });
      },

      tick: () => {
        const { timeLeft, isPlaying } = get();
        if (isPlaying && timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 });
        } else if (timeLeft === 0) {
          get().endGame();
        }
      },
    }),
    {
      name: 'game-progress', // Name for localStorage persistence
      partialize: (state) => ({
        // Only persist the difficulty level per operation
        [state.operation]: state.difficultyLevel,
      }),
    }
  )
);